var util = require('./util');
var API_CONFIG = require("../config/appConstants");
var crypto = require("../config/crypto");
var connection = require("../config/db");
var queries = require("../config/dbQueries");
var md5 = require('MD5');
var FB = require('fb');
var querystring = require('querystring');
var https = require('https');

module.exports = function(app) {
    return {
        login: function(req, res) {
            if(req.IV_ID.userLoggedIn && req.IV_ID.userEmail) {
                userResponse = {
                    message: "User session already exists",
                    success: false
                };
                res.json(userResponse);
                return;
            }
            if(!util.checkIfValidEmail(req.query.userEmail, res) || !util.checkIfValidPassword(req, res, API_CONFIG.PASSWORD_MIN_LENGTH)) {
                return;
            }
            var userData = {
                userEmail: req.query.userEmail,
                password: md5(req.query.password)
            };
            // Check if valid request is sent by the user
            if(!crypto.validateAuthorization(req, res, userData)) {
                return;
            }
            var query = queries.LOGIN_QUERY.replace("{email}", userData.userEmail).replace("{password}", userData.password);
            var userResponse;
            connection.query(query, function(err, rows, fields) {
                if (err) {
                    throw err;
                }
                if(rows.length === 1) {
                    userResponse = {
                        message: "User successfully logged in!",
                        success: true,
                        data: rows
                    };
                    req.IV_ID.userLoggedIn = true;
                    req.IV_ID.userEmail = req.query.userEmail;
                    req.IV_ID.userId = rows[0].id;
                } else {
                    userResponse = {
                        message: "Username or password provided is not valid",
                        success: false,
                        data: []
                    };
                }
                res.json(userResponse);
            });
        },
        register: function (req, res) {
            if(req.IV_ID.userLoggedIn && req.IV_ID.userEmail) {
                userResponse = {
                    message: "User session already exists",
                    success: false
                };
                res.json(userResponse);
                return;
            }
            // Validate Email provided by the user & Validate password for minimum strength of 6 characters
            if(!util.checkIfValidEmail(req.query.userEmail, res) || !util.checkIfValidPassword(req, res, API_CONFIG.PASSWORD_MIN_LENGTH)) {
                return;
            }
            var userData = {
                userEmail: req.query.userEmail,
                password: md5(req.query.password)
            };
            // Check if valid request is sent by the user
            if(!crypto.validateAuthorization(req, res, userData)) {
                return;
            }
            var existsQuery = queries.USER_EXISTS.replace("{email}", userData.userEmail);
            var userResponse;
            connection.query(existsQuery, function(err, rows, fields) {
                if (err) {
                    throw err;
                }
                if(rows.length === 1 && rows[0].count) {
                    userResponse = {
                        message: "User already registered.",
                        success: false
                    };
                    res.json(userResponse);
                    return;
                }
                var query = queries.REGISTER_QUERY.replace("{email}", userData.userEmail).replace("{password}", userData.password);
                connection.query(query, function(err, rows, fields) {
                    if (err) {
                        throw err;
                    }
                    if(rows.affectedRows) {
                        userResponse = {
                            message: "User successfully registered.",
                            success: true,
                            data: {
                                userId: rows.insertId,
                                email: userData.userEmail
                            }
                        };
                        req.IV_ID.userLoggedIn = true;
                        req.IV_ID.userEmail = userData.userEmail;
                    } else {
                        userResponse = {
                            message: "There was some issue while user registration",
                            success: false,
                        };
                    }
                    res.json(userResponse);
                });
            });
        },
        subscribe: function (req, res) {
            if(req.IV_ID.userLoggedIn && req.IV_ID.userEmail) {
                userResponse = {
                    message: "User session already exists",
                    success: false
                };
                res.json(userResponse);
                return;
            }
            // Validate Email provided by the user & Validate password for minimum strength of 6 characters
            if(!util.checkIfValidEmail(req.query.userEmail, res)) {
                return;
            }
        	var userData = {
                 userEmail: req.query.userEmail
        	};
        	// Check if valid request is sent by the user
            if(!crypto.validateAuthorization(req, res, userData)) {
                return;
            }
            var existsQuery = queries.SUBSCRIBE_USER_EXISTS.replace("{email}", userData.userEmail).replace("{email}", userData.userEmail);
            var query = queries.SUBSCRIBE_USER.replace("{email}", userData.userEmail);
            var userResponse;
            connection.query(existsQuery, function(err, rows, fields) {
                if (err) {
                    throw err;
                }
                if (rows.length === 1 && rows[0].count) {
                    userResponse = {
                        message: "User already registered.",
                        success: false
                    };
                    res.json(userResponse);
                    return;
                }
                connection.query(query, function (err, rows, fields) {
                    if (err) {
                        throw err;
                    }
                    if (rows.affectedRows) {
                        userResponse = {
                            message: "User successfully subscribed.",
                            success: true
                        };
                    } else {
                        userResponse = {
                            message: "There was some issue while user registration",
                            success: false,
                        };
                    }
                    res.json(userResponse);
                });
            });
        },
        validateFBLogin: function(req, res) {
            var userResponse;
            if(req.IV_ID.userLoggedIn && req.IV_ID.userEmail) {
                userResponse = {
                    message: "User session already exists",
                    success: false
                };
                res.json(userResponse);
                return;
            }
            var userData = {
                userID: req.query.userID,
                accessToken: req.query.accessToken,
                signedRequest: req.query.signedRequest
            };
            if(!crypto.validateAuthorization(req, res, userData)) {
                return;
            }
            FB.setAccessToken(userData.accessToken);
            var signedRequest  = FB.parseSignedRequest(userData.signedRequest, API_CONFIG.FB_APP_SECRET);
            FB.api('me', {locale: 'en_US', fields: ['id', 'email']}, function(response) {
                if(!response || response.error_msg) {
                    userResponse = {
                        message: "Login failed. Please try again",
                        success: false
                    };
                    res.json(userResponse);
                    return;
                }
                if(response.email) {
                    userData.userEmail = response.email;
                    if(response.id === signedRequest.user_id) {
                        var query = queries.GET_USER_DETAILS.replace("{email}", userData.userEmail);
                        connection.query(query, function(err, rows, fields) {
                            if (err) {
                                throw err;
                            }
                            if(rows.length === 1) {
                                userResponse = {
                                    message: "User successfully logged in!",
                                    success: true,
                                    data: rows
                                };
                                req.IV_ID.userLoggedIn = true;
                                req.IV_ID.userEmail = userData.userEmail;
                                req.IV_ID.userId = rows[0].id;
                            } else {
                                userResponse = {
                                    message: "Username or password provided is not valid",
                                    success: false,
                                    data: []
                                };
                            }
                            res.json(userResponse);
                        });
                    }
                }
            });
        },
        validateGoogleLogin: function(req, res) {
            var userResponse;
            if(req.IV_ID.userLoggedIn && req.IV_ID.userEmail) {
                userResponse = {
                    message: "User session already exists",
                    success: false
                };
                res.json(userResponse);
                return;
            }
            var userData = {
                userToken: req.query.userToken,
                userEmail: req.query.userEmail
            };
            if(!crypto.validateAuthorization(req, res, userData)) {
                return;
            }
            var data = querystring.stringify({
                id_token: req.query.userToken
            });

            var optionUrl = 'https://www.googleapis.com' + '/oauth2/v3/tokeninfo?' + data;
            var httpreq = https.request(optionUrl, function (response) {
                var userEmail;
                response.on('data', function (googleResponse) {
                    googleResponse = JSON.parse(googleResponse.toString());
                    if(googleResponse.email_verified) {
                        userEmail = googleResponse.email;
                    }
                });
                response.on('end', function() {
                    if(userEmail) {
                        var query = queries.GET_USER_DETAILS.replace("{email}", userEmail);
                        connection.query(query, function(err, rows, fields) {
                            if (err) {
                                throw err;
                            }
                            if(rows.length === 1) {
                                userResponse = {
                                    message: "User successfully logged in!",
                                    success: true,
                                    data: rows
                                };
                                req.IV_ID.userLoggedIn = true;
                                req.IV_ID.userEmail = userEmail;
                                req.IV_ID.userId = rows[0].id;
                            } else {
                                userResponse = {
                                    message: "User not registered yet",
                                    success: true,
                                    data: {
                                        userEmail: userEmail
                                    }
                                };
                            }
                            res.json(userResponse);
                        });
                    } else {
                        userResponse = {
                            message: "Login failed. Please try again",
                            success: false
                        };
                        res.json(userResponse);
                    }
                });
            });
            httpreq.end();
        },
        authenticateForgotPassword : function( req, res ){
            var userData = {
                //q: req.query.q
                q: "Mi0xNDUwNjQ0MTQ1NDA4"
            };

            if(!crypto.validateAuthorization(req, res, userData)) {
                return;
            }


            var forgotPasswordToken = new Buffer(userData.q, 'base64');
            var tokenArray = forgotPasswordToken.toString().split("-");
            var userId = tokenArray[0];
            var difference = new Date().getTime() - tokenArray[1];
            var minutesDifference = Math.floor(difference/1000/60);

            if(minutesDifference <= 30){
                //redirect to change password
                res.redirect('http://ivokio.com/user/set-new-password');
            }

            var userResponse = {
                success:false,
                message:"This link is expired please generate a new link"
            };
            console.log(minutesDifference);

            res.json(userData);
        },
        setNewPassword : function (req, res){
            var userResponse;
            if(!util.checkIfValidEmail(req.query.userEmail, res) || !util.checkIfValidPassword(req, res, API_CONFIG.PASSWORD_MIN_LENGTH)) {
                return;
            }
            var userData = {
                userEmail: req.query.userEmail,
                password: md5(req.query.password),
                q: req.query.q
            };
            // Check if valid request is sent by the user
            if(!crypto.validateAuthorization(req, res, userData)) {
                return;
            }
            var forgotPasswordToken = new Buffer(userData.q, 'base64');
            var tokenArray = forgotPasswordToken.toString().split("-");
            var userId = tokenArray[0];
            var difference = new Date().getTime() - tokenArray[1];
            var minutesDifference = Math.floor(difference/1000/60);

            if(minutesDifference > 30){
                userResponse = {
                    success:false,
                    message:"This link is expired please generate a new link"
                };
                res.json(userResponse);
                return;
            }

            var query = queries.CHANGE_PASSWORD.replace("{userId}", userId).replace("{email}", userData.userEmail).replace("{password}", userData.password);
            connection.query(query, function(err, result) {
                if (err) {
                    throw err;
                }
                if(result.affectedRows !== 0) {
                    userResponse = {
                        message: "password has been reset successfully!",
                        success: true
                    };
                    req.IV_ID.userLoggedIn = true;
                    req.IV_ID.userEmail = req.query.userEmail;
                    req.IV_ID.userId = userId;
                } else {
                    userResponse = {
                        message: "Not able to reset password please contact customer care",
                        success: false
                    };
                }
                res.json(userResponse);
            });            
        }
    };
};

