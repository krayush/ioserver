var util = require('./util');
var crypto = require("../vendor/crypto");
var connection = require("../config/db");
var queries = require("../config/dbQueries");
var q = require('q');

module.exports = {
    registerSession: function (req, res) {
        var userResponse;
        var userData = req.query.data;
        if (!crypto.validateAuthorization(req, res, userData)) {
            return;
        }
        // User is authorized here -------------
        // name = req.getUserName();
        // token  = generateToken(name);
        // pushToDB(user,token).done(){
        //     end Call with {
        //         token : "token",
        //     };
        // }


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
    }
};