var util = require('./util');
var crypto = require("../vendor/crypto");
var md5 = require('md5');
var connection = require("../config/db");
var queries = require("../config/dbQueries");

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
            req.query.data = req.query.data || {
                    userId:"test"
                };
            if (!crypto.validateAuthorization(req, res, req.query.data)) {
                return;
            }
            // ------------- User is authorized here -------------
            var sessionToken = sessionTokenGenerator(req, res);
            var userId = req.query.data.userId;
            if(userId) {
                connection.query(queries.SUBSCRIBE_USER,
                    [userId, sessionToken],
                    function(err) {
                        if (err) {
                            userResponse = {
                                success: false,
                                message: err
                            };
                        } else {
                            userResponse = {
                                data: {
                                    sessionToken: sessionToken
                                },
                                success: true,
                                message: ""
                            };
                        }
                        res.json(userResponse);
                    }
                );
            } else {
                userResponse = {
                    success: false,
                    message: ""
                };
                res.json(userResponse);
            }
        }
    };
})();