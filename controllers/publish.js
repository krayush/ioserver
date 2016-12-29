var crypto = require("../vendor/crypto");
var appConstants = require("../config/appConstants");
var sessionInstances = require('../models/sessionTokens')();

module.exports = (function() {
    var publishToSingleUser = function(req, res, token) {
        var request = req.body.data;
        sessionInstances[token].emit("message-received", request.message);
    };
    var evaluateAction = function(req, res) {
        try {
            var data = req.body.data;
            if(sessionInstances[data.sessionToken]) {
                //sessionInstances["2781b890-c83a-11e6-9fe3-4903fdf92c48"].emit("message-received", "TEST");
                switch (data.action) {
                    case "PUBLISH_SINGLE":
                        publishToSingleUser(req, res, data.sessionToken);
                        res.json({ success: true });
                        break;
                    case "PUBLISH_ALL_BY_USER":
                        //getSessionTokensByToken();
                        //res.json({ success: true });
                        break;
                    case "PUBLISH_ALL":

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