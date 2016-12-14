/**
 * JavaScript implementation of API authentication signature creation method
 * using token and secret key. It user Hash HMAC algorithm with SHA256.
 *
 * Include hmac-sha256.js for CryptoJS lib inclusion
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
var CryptoJS = require("../vendor/hmac-sha256");
var API_CONFIG = require("./appConstants");

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
    var hash = CryptoJS.HmacSHA256(longStr.trim(), secret);
    return (new Buffer(JSON.stringify(hash)).toString('base64'));
};

module.exports = {
    encrypt: cryptoAlgorithm,
    validateAuthorization: function (req, res, userData) {
        var requestMethod = req.method, userResponse;
        var url = req.protocol + '://' + req.get('host') + req.originalUrl;
        var token = API_CONFIG.appKeys["token-key"];
        //res.headers[API_CONFIG.AUTH_HEADERS.TOKEN];
        var secret = API_CONFIG.appKeys["secret-key"];
        //res.headers[API_CONFIG.AUTH_HEADERS.SIGN];
        var encryptedData = cryptoAlgorithm(token, secret, userData, url, requestMethod);
        // Line to be commented or removed later
        req.query.encryptedData = encryptedData;
        if(req.query.encryptedData !== encryptedData) {
            userResponse = {
                message: "You are not authorized to view this page.",
                success: false
            };
            res.json(userResponse);
            return;
        }
        return true;
    }
};