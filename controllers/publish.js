var crypto = require("../vendor/crypto");
var appConstants = require("../config/appConstants");
var sessionInstances = require('../models/sessionTokens')();

module.exports = (function() {
    var evaluateAction = function(req, res) {
        try {
            var data = JSON.parse(req.body.data);
            if(sessionInstances[req.body.sessionToken]) {
                sessionInstances[req.body.sessionToken].broadcast.emit(data.message);
            }
            sessionInstances["2781b890-c83a-11e6-9fe3-4903fdf92c48"].emit("message-received", "TEST");
            // switch(data.action) {
            //     case "":
            //         break;
            //     case "":
            //         break;
            //     case "":
            //         break;
            // }
            res.json({
                success: true,
                message: ""
            });
        } catch (e) {
            res.json({
                success: false,
                message: appConstants.messages.invalidDataFromServer
            });
        }
    };
    return {
        publish: function(req, res) {
            // if (!crypto.validateAuthorization(req, res, req.body)) {
            //     return;
            // }
            return evaluateAction(req, res);
        }
    };
})();