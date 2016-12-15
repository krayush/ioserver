var util = require('./util');
var API_CONFIG = require("../config/appConstants");
var crypto = require("../config/crypto");
var connection = require("../config/db");
var queries = require("../config/dbQueries");
var fs = require('fs');
var q = require('q');

module.exports = {
    registerSession: function (req, res) {
        var userResponse;
        var userData = {
            userId: req.query.userId
        };
        if (!util.checkIfValidInteger(res, req.query.userId) || !crypto.validateAuthorization(req, res, userData)) {
            return;
        }
        var query = queries.USER_REVIEWS_QUERY.replace("{userId}", userData.userId);
        connection.query(query, function (err, rows) {
            if (err) {
                throw err;
            }
            if (rows && rows.length) {
                userResponse = {
                    success: true,
                    data: rows,
                    message: ""
                };
            } else {
                userResponse = {
                    success: false,
                    message: "No rows found"
                };
            }
            res.json(userResponse);
        });
    },
    reviewLender: function (req, res) {
        //Check for user existence pending
        var userResponse;
        if(!(req.IV_ID.userLoggedIn && req.IV_ID.userEmail && req.IV_ID.userId)) {
            userResponse = {
                message: "User not logged in",
                success: false
            };
            res.json(userResponse);
            return;
        }

        var userData = {
            userId: req.query.userId,
            description: req.query.description,
            rating: req.query.rating,
            title: req.query.title,
            isAnonymous: req.query.isAnonymous
        };

        if(req.IV_ID.userId.toString() === userData.userId.toString()) {
            userResponse = {
                message: "User can't review his/her own profile",
                success: false
            };
            res.json(userResponse);
            return;
        }

        if (!util.checkIfValidInteger(res, req.query.userId) ||
                !crypto.validateAuthorization(req, res, userData ||
                !util.checkIfValidInteger(res, req.query.rating))) {
            return;
        }
        if(!userData.description || !userData.title) {
            userResponse = {
                message: "Insufficient data to make a review entry",
                success: false
            };
            res.json(userResponse);
            return;
        }

        userData.description = (new Buffer(JSON.stringify(userData.description)).toString('base64'));
        userData.title = (new Buffer(JSON.stringify(userData.title)).toString('base64'));
        userData.isAnonymous = (userData.isAnonymous === 'true');

        if(userData.rating < 1) {
            userData.rating = 1;
        }
        if(userData.rating > 5) {
            userData.rating = 5;
        }
        var insertQuery = queries.INSERT_REVIEWS_QUERY.replace("{userId}", userData.userId)
            .replace("{description}", userData.description)
            .replace("{rating}", userData.rating)
            .replace("{title}", userData.title)
            .replace("{reviewer}", req.IV_ID.userId)
            .replace("{isAnonymous}", userData.isAnonymous);

        connection.query(insertQuery, function (err, response) {
            if (err) {
                throw err;
            }
            if(response && response.insertId) {
                var selectReview = queries.SELECT_REVIEWS_QUERY.replace("{id}", response.insertId);
                connection.query(selectReview, function (err, rows) {
                    if (err) {
                        throw err;
                    }
                    if(rows && rows.length) {
                        userResponse = {
                            success: true,
                            data: rows,
                            message: ""
                        };
                    } else {
                        userResponse = {
                            success: false,
                            message: "No rows found"
                        };
                    }
                    res.json(userResponse);
                });

            } else {
                userResponse = {
                    success: false,
                    message: "No rows found"
                };
                res.json(userResponse);
            }
        });
    },
    saveDetails: function (req, res) {
        console.log("reached user/saveDetails");
        var userResponse;
        var userData = req.body;

        if ( !crypto.validateAuthorization(req, res, userData) ) {
            return;
        }
       
        var saveUserDetailsQuery = queries.SAVE_USER_DETAILS.replace("{full_name}", userData.full_name )
                .replace("{email}", userData.email )
                .replace("{mobile}", userData.mobile )
                .replace("{profile_pic}", userData.profile_pic )
                .replace("{address}", userData.address )
                .replace("{city}", userData.city )
                .replace("{state}", userData.state )
                .replace("{alternate_number}", userData.alternate_number )
                .replace("{id}", userData.id );
        connection.query(saveUserDetailsQuery, function(err, result) {
            var userResponse;
            if (err) {
                throw err;
            }
            if(result && result.affectedRows) {
                userResponse = {
                    success: true,
                    message: result.message
                };
            } else {
                userResponse = {
                    success: false,
                    message: "No rows found"
                };
            }
            console.log(result);
            res.json(userResponse);
        });
    },
    getUserDetails: function(emailId) {
        var query = queries.GET_USER_DETAILS.replace("{email}", emailId);
        var deferred = q.defer();
        connection.query(query, deferred.makeNodeResolver());
        return deferred.promise;
    },
    getForgotPasswordLink : function (req, res){
        var userResponse;
        var userData = {
           userEmail: req.query.email
        };
        if(!crypto.validateAuthorization(req, res, userData)) {
            return;
        }
        var query = queries.GET_USER_DETAILS.replace("{email}", userData.userEmail);
        connection.query(query, function (err, rows) {
            if (err) {
                throw err;
            }
            if(rows && rows.length) {
                //generate link by userId-TimeStamp
                var id = rows[0].id;
                var timeStamp = new Date().getTime();
                var forgotPasswordToken = id + "-" + timeStamp ;
                forgotPasswordToken = new Buffer(forgotPasswordToken).toString('base64');
                var userDataLink = {
                    q: forgotPasswordToken 
                };
                var url = 'http://ivokio.com/authenticate/authenticate';
                var token = API_CONFIG.appKeys["token-key"];
                var secret = API_CONFIG.appKeys["secret-key"];
                var encryptedData = crypto.encrypt(token, secret, userDataLink, url, 'GET');
                var mailContent = '';
                fs.readFile('./templates/resetPassword.html', function read(err, data) {
                    if (err) {
                        throw err;
                    }
                    mailContent = data.toString();
                    mailContent = mailContent.replace('{{name}}', rows[0].full_name);
                    mailContent = util.replaceAll( mailContent,'{{action_url}}','http://ivokio.com/authentication/authenticate?q=' +
                            forgotPasswordToken +
                            '&encryptedData='+encryptedData);
                    contact.sendSupportMail(rows[0].email, 'Reset Password', mailContent);
                });
                userResponse = {
                    success: true,
                    message: "A reset password link has been sent to your email id"
                };
            } else {
                userResponse = {
                    success: false,
                    message: "Sorry.!!! No user found with the given email id"
                };
            }
            res.json(userResponse);
        });
    },
    getOrdersByUser: function(req, res) {
        var userResponse;
        if(!(req.IV_ID.userLoggedIn && req.IV_ID.userEmail && req.IV_ID.userId)) {
            userResponse = {
                message: "User not logged in",
                success: false
            };
            res.json(userResponse);
            return;
        }
        var userData = {
            userId: req.IV_ID.userId
        };
        if(!crypto.validateAuthorization(req, res, userData) || !util.checkIfValidInteger(res, userData.userId)) {
            return;
        }
        var query = queries.GET_ORDERS_BY_USER.replace("{renter_id}", userData.userId);
        connection.query(query, function(err, rows) {
            if (err) {
                throw err;
            }
            if(rows.length > 1) {
                var response = {};
                for(var index in rows) {
                    var row = rows[index];
                    if(!response[row.order_id]) {
                        response[row.order_id] = {
                            renterId: row.renter_id,
                            orderId: row.order_id,
                            orderTime: row.order_time,
                            address: row.address,
                            products: []
                        };
                    }
                    response[row.order_id].products.push({
                        productId: row.product_id,
                        productCount: row.product_count,
                        productName: row.productName,
                        brand: row.brand,
                        rent: row.rent
                    });
                }
                userResponse = {
                    message: "",
                    success: true,
                    data: response
                };
            } else {
                userResponse = {
                    message: "No order details present.",
                    success: false
                };
            }
            res.json(userResponse);
        });
    },
    getSavedAddresses: function(req, res) {
        var userResponse;
        if(!(req.IV_ID.userLoggedIn && req.IV_ID.userEmail && req.IV_ID.userId)) {
            userResponse = {
                message: "User not logged in",
                success: false
            };
            res.json(userResponse);
            return;
        }
        var userData = {
            userId: req.IV_ID.userId
        };
        if(!crypto.validateAuthorization(req, res, userData) || !util.checkIfValidInteger(res, userData.userId)) {
            return;
        }
        var query = queries.GET_SAVED_ADDRESSES.replace("{userId}", userData.userId);
        connection.query(query, function(err, rows) {
            if (err) {
                throw err;
            }
            userResponse = {
                message: "",
                success: true,
                data: rows
            };
            res.json(userResponse);
        });
    },
    deleteSavedAddresses: function(req, res) {
        var userResponse;
        if(!(req.IV_ID.userLoggedIn && req.IV_ID.userEmail && req.IV_ID.userId)) {
            userResponse = {
                message: "User not logged in",
                success: false
            };
            res.json(userResponse);
            return;
        }
        var userData = {
            userId: req.IV_ID.userId,
            addressId: req.IV_ID.addressId
        };
        if(!crypto.validateAuthorization(req, res, userData) || !util.checkIfValidInteger(res, userData.userId) || !util.checkIfValidInteger(res, userData.addressId)) {
            return;
        }
        var query = queries.DELETE_SAVED_ADDRESSES.replace("{userId}", userData.userId).replace("{addressId}", userData.addressId);
        connection.query(query, function(err, rows) {
            if (err) {
                throw err;
            }
            if(rows.affectedRows) {
                userResponse = {
                    message: "",
                    success: true
                };
            } else {
                userResponse = {
                    message: "Address details not found",
                    success: false
                };
            }
            res.json(userResponse);
        });
    },
    saveNewAddress: function(req, res) {
        var userResponse;
        if(req.IV_ID.userLoggedIn && req.IV_ID.userEmail && req.IV_ID.userId) {
            userResponse = {
                message: "User session already exists",
                success: false
            };
            res.json(userResponse);
            return;
        }
        var userData = {
            orderId: req.query.orderId,
            name: btoa(req.query.name),
            pincode: req.query.pincode,
            address: btoa(req.query.address),
            mobile: req.query.mobile,
            landmark: btoa(req.query.landmark),
            city: btoa(req.query.city),
            address_type: req.query.address_type,
            is_default: req.query.is_default
        };
        if(!crypto.validateAuthorization(req, res, userData) || !util.checkIfValidEmail(userData.userEmail, res) || !util.checkIfValidInteger(res, userData.orderId)) {
            return;
        }
    }
};