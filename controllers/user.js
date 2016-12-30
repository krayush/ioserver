var crypto = require("../vendor/crypto");
var uuid = require('node-uuid');
var connection = require("../config/db");
var queries = require("../config/dbQueries");
var appConstants = require("../config/appConstants");
var sessionTokens = require("../models/sessionTokens")();

module.exports = (function() {
    var sessionTokenGenerator = function(req, res) {
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
            var sessionToken = sessionTokenGenerator(req, res);
            sessionTokens[sessionToken] = {
                creationDate: new Date().getTime()
            };
            var userId = req.body.data.userId;
            if(userId) {
                connection.query(queries.SUBSCRIBE_USER,
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
            if(sessionToken) {
                connection.query(req.body.data.endAllSessions ? queries.END_ALL_SESSIONS: queries.END_CURRENT_SESSION,
                    [sessionToken],
                    function(err) {
                        if (err) {
                            userResponse = {
                                success: false,
                                message: err
                            };
                        } else {
                            userResponse = {
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
        }
    };
})();