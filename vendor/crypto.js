/**
 * JavaScript implementation of API authentication signature creation method
 * using token and secret key. It user Hash HMAC algorithm with SHA256.
 *
 * Include hmac-sha256.js for cryptoJS lib inclusion
 *
 * @param {String}
 *            token Unique auth token provided to user
 * @param {String}
 *            secret Secret key of the user
 * @param {Object}
 *            data Request parameters as key value pair
 * @param {String}
 *            url complete API url without query string or request params
 * @param {String}
 *            requestMethod HTTP request method for this request
 *            (GET|POST|PUT|DELETE|OPTIONS)
 * @returns {String} base64 encoded signature
 */
var cryptoJS = require("./hmac-sha256");
var appConstants = require("../config/appConstants");
var btoa = require("btoa");
var cryptoAlgorithm = function(token, secret, data, url, requestMethod) {
    data = (function(o) {
        var sorted = {}, key, a = [];
        for (key in o) {
            if (o.hasOwnProperty(key)) {
                a.push(key);
            }
        }
        a.sort();
        for (key = 0; key < a.length; key++) {
            sorted[a[key]] = o[a[key]];
        }
        return sorted;
    })(data);
    var longStr = requestMethod + '|' + url + "\n";
    for ( var key in data) {
        if (data.hasOwnProperty(key)) {
            longStr += (key + data[key]);
        }
    }
    longStr += token;
    var hash = cryptoJS.HmacSHA256(longStr.trim(), secret);
    return btoa(hash);
};

module.exports = {
    encrypt: cryptoAlgorithm,
    validateAuthorization: function (req, res, userData) {
        var requestMethod = req.method, userResponse;
        var url = req.protocol + '://' + req.get('host') + req.originalUrl;
        var token = req.headers[appConstants.authHeaders.token];
        var secret = appConstants.appKeys[req.headers[appConstants.authHeaders.token]];
        var encryptedData = cryptoAlgorithm(token, secret, userData, url, requestMethod);
        if(req.body.encryptedData !== encryptedData) {
            res.json({
                message: appConstants.messages.authFailed,
                success: false
            });
            return false;
        }
        return true;
    }
};