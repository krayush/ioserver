var crypto = require("../vendor/crypto");
var appConstants = require("../config/appConstants");

module.exports = (function() {
    var evaluateAction = function(req, res) {
        try {
            var data = JSON.parse(req.body.data);
            switch(data.action) {
                case "":
                    break;
                case "":
                    break;
                case "":
                    break;
            }
            //req.body.sessionToken;
            //data.message;

        } catch (e) {
            res.json({
                success: false,
                message: appConstants.messages.invalidDataFromServer
            });
        }
    };
    return {
        publish: function(req, res) {
            if (!crypto.validateAuthorization(req, res, req.body)) {
                return;
            }
            return evaluateAction(req, res);
        }
    };
})();