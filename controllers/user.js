var crypto = require("../vendor/crypto");
var uuid = require('node-uuid');
var connection = require("../config/db");
var queries = require("../config/dbQueries");
var appConstants = require("../config/appConstants");
var sessionTokens = require("../models/sessionTokens")();
var traverse = require("traverse");

module.exports = (function() {
    var sessionTokenGenerator = function() {
        return uuid.v1();
    };
    return {
        registerSession: function (req, res) {
            var userResponse;
            req.body.data = req.body.data || {};
            if (!crypto.validateAuthorization(req, res, req.body.data)) {
                return;
            }
            // ------------- User is authorized here -------------
            var sessionToken = sessionTokenGenerator();
            sessionTokens[req.headers[appConstants.authHeaders.token]][sessionToken] = {
                creationDate: new Date().getTime(),
                appKey: req.headers[appConstants.authHeaders.token]
            };
            var userId = req.body.data.userId;
            if(userId) {
                connection.query(queries.CREATE_USER,
                    [userId, sessionToken, req.headers[appConstants.authHeaders.token]],
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
                                success: true
                            };
                        }
                        res.json(userResponse);
                    }
                );
            } else {
                userResponse = {
                    success: false,
                    message: appConstants.messages.authFailed
                };
                res.json(userResponse);
            }
        },
        endSession: function(req, res) {
            var userResponse;
            req.body.data = req.body.data || {};
            if (!crypto.validateAuthorization(req, res, req.body.data)) {
                return;
            }
            // ------------- User is authorized here -------------
            var sessionToken = req.body.data.sessionToken;
            if(sessionToken || req.body.data.action === "END_ALL") {
                switch (req.body.data.action) {
                    case "END_SINGLE":
                        connection.query(queries.END_CURRENT_SESSION, [sessionToken],
                            function(err) {
                                if (err) {
                                    res.json({
                                        success: false,
                                        message: err
                                    });
                                } else {
                                    delete sessionTokens[req.headers[appConstants.authHeaders.token]][sessionToken];
                                    res.json({ success: true });
                                }
                            }
                        );
                        break;
                    case "END_ALL_BY_USER":
                        connection.query(queries.END_ALL_SESSIONS_BY_USER,
                            [req.body.data.sessionToken, req.headers[appConstants.authHeaders.token]],
                            function(err, rows) {
                                if (err) {
                                    res.json({
                                        success: false,
                                        message: err
                                    });
                                } else {
                                    // traverse(sessionTokens[req.headers[appConstants.authHeaders.token]]).map(function(x) {
                                    //     if(this.isLeaf) {
                                    //         //something to be done
                                    //     }
                                    // });
                                    res.json({ success: true });
                                }
                            }
                        );
                        break;
                    case "END_ALL":
                        connection.query(queries.END_ALL_SESSIONS,
                            [req.headers[appConstants.authHeaders.token]],
                            function(err) {
                                if (err) {
                                    res.json({
                                        success: false,
                                        message: err
                                    });
                                } else {
                                    sessionTokens[req.headers[appConstants.authHeaders.token]] = {};
                                    res.json({ success: true });
                                }
                            }
                        );
                        break;
                    default:
                        res.json({
                            success: false,
                            message: appConstants.messages.invalidAction
                        });
                }
            } else {
                userResponse = {
                    success: false,
                    message: appConstants.messages.authFailed
                };
                res.json(userResponse);
            }
        }
    };
})();