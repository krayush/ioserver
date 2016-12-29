var crypto = require("../vendor/crypto");
var appConstants = require("../config/appConstants");
var sessionInstances = require('../models/sessionTokens')();
var connection = require("../config/db");
var queries = require("../config/dbQueries");

module.exports = (function() {
    var publishToSingleUser = function(req, res, token) {
        var request = req.body.data;
        sessionInstances[token].emit("message-received", request.message);
    };
    var evaluateAction = function(req, res) {
        try {
            var data = req.body.data;
            if(sessionInstances[data.sessionToken] || (data.action === "PUBLISH_ALL")) {
                //sessionInstances["2781b890-c83a-11e6-9fe3-4903fdf92c48"].emit("message-received", "TEST");
                switch (data.action) {
                    case "PUBLISH_SINGLE":
                        publishToSingleUser(req, res, data.sessionToken);
                        res.json({ success: true });
                        break;
                    case "PUBLISH_ALL_BY_USER":
                        connection.query(queries.GET_ALL_SESSIONS_BY_ID, [data.sessionToken], function(err, rows) {
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
                        });
                        break;
                    case "PUBLISH_ALL":
                        connection.query(queries.GET_ALL_SESSIONS, function(err, rows) {
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
                        });
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
        publish: function(req, res) {
            if (!crypto.validateAuthorization(req, res, req.body.data)) {
                return;
            }
            return evaluateAction(req, res);
        }
    };
})();