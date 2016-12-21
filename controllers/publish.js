var crypto = require("../vendor/crypto");
var md5 = require('md5');

module.exports = (function() {
    return {
        publish: function(req, res) {
            var userResponse;
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
                    message: appConstants.messages.authFailed
                };
                res.json(userResponse);
            }
        }
    };
})();