var crypto = require("../vendor/crypto");
var appConstants = require("../config/appConstants");
var sessionTokens = require('../models/sessionTokens')();
var connection = require("../config/db");
var queries = require("../config/dbQueries");

module.exports = (function() {
    var socketio;
    var publishToSingleUser = function(req, res, token) {
        var request = req.body.data;
        var sessionData = sessionTokens[req.headers[appConstants.authHeaders.token]][token];
        if(sessionData && sessionData.sessionInstance) {
            sessionData.sessionInstance.emit(
                req.headers[appConstants.authHeaders.token] + "/message-received",
                request.message
            );
        }
    };
    var evaluateAction = function(req, res) {
        try {
            var data = req.body.data;
            if(sessionTokens[req.headers[appConstants.authHeaders.token]][data.sessionToken] || data.action === "PUBLISH_ALL") {
                switch (data.action) {
                    case "PUBLISH_SINGLE":
                        publishToSingleUser(req, res, data.sessionToken);
                        res.json({ success: true });
                        break;
                    case "PUBLISH_ALL_BY_USER":
                        connection.query(queries.GET_ALL_SESSIONS_BY_ID,
                            [data.sessionToken, req.headers[appConstants.authHeaders.token]],
                            function(err, rows) {
                                if (err) {
                                    res.json({
                                        success: false,
                                        message: err
                                    });
                                } else {
                                    if(rows && rows.length) {
                                        rows.map(function (row) {
                                            publishToSingleUser(req, res, row.session_token);
                                        });
                                    }
                                    res.json({ success: true });
                                }
                            }
                        );
                        break;
                    case "PUBLISH_ALL":
                        socketio.sockets.emit(
                            req.headers[appConstants.authHeaders.token] + "/message-received",
                            data.message
                        );
                        res.json({ success: true });
                        break;
                    default:
                        res.json({
                            success: false,
                            message: appConstants.messages.invalidAction
                        });
                }
            } else {
                res.json({
                    success: false,
                    message: appConstants.messages.noValidSession
                });
            }
        } catch (e) {
            res.json({
                success: false,
                message: appConstants.messages.invalidDataFromServer
            });
        }
    };
    return {
        publish: function (io) {
            socketio = io;
            return function (req, res) {
                if (!crypto.validateAuthorization(req, res, req.body.data)) {
                    return;
                }
                return evaluateAction(req, res, io);
            };
        }
    };
})();