var appConstants = require('../config/appConstants');
module.exports = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", appConstants.appServerURL);
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Content-Type, X-Api-Signature, X-Api-AuthToken");
    next();
};