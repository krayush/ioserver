var util = require('./util');
var crypto = require("../vendor/crypto");
var md5 = require('md5');
var connection = require("../config/db");
var queries = require("../config/dbQueries");
var q = require('q');

module.exports = (function() {
    var sessionTokenGenerator = function(req, res) {
        var data = {
            userId: req.query.data.userId,
            timeStamp: new Date().getTime()
        };
        return md5(data);
    };
    return {
        registerSession: function (req, res) {
            var userResponse;
            var userData = req.query.data || {};
            if (!crypto.validateAuthorization(req, res, userData)) {
                return;
            }
            // ------------- User is authorized here -------------
            var sessionToken = sessionTokenGenerator(req, res);
            var userId = req.query.data.userId;
            if(userId) {
                connection.query(queries.SUBSCRIBE_USER,
                    [userId, sessionToken],
                    function(err, results) {
                        if (err) {
                            throw err;
                        }
                        if(response && response.insertId) {

                        }
                    }
                );
            } else {
                userResponse = {
                    success: false,
                    message: ""
                };
            }
            res.json(userResponse);


            // connection.query(insertQuery, function (err, response) {
            //     if (err) {
            //         throw err;
            //     }
            //     if(response && response.insertId) {
            //         var selectReview = queries.SELECT_REVIEWS_QUERY.replace("{id}", response.insertId);
            //         connection.query(selectReview, function (err, rows) {
            //             if (err) {
            //                 throw err;
            //             }
            //             if(rows && rows.length) {
            //                 userResponse = {
            //                     success: true,
            //                     data: rows,
            //                     message: ""
            //                 };
            //             } else {
            //                 userResponse = {
            //                     success: false,
            //                     message: "No rows found"
            //                 };
            //             }
            //             res.json(userResponse);
            //         });
            //
            //     } else {
            //         userResponse = {
            //             success: false,
            //             message: "No rows found"
            //         };
            //         res.json(userResponse);
            //     }
            // });
        }
    };
})();