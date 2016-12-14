var sessions = require("client-sessions");
var express = require('express');

module.exports = function(app) {
    return {
        validateLogin: function(req, res, next) {
            if (req.IV_ID.userLoggedIn && req.IV_ID.userEmail) {
                res.setHeader('X-Request-Header', 'true');
            } else {
                res.setHeader('X-Request-Header', 'false');
            }
            next();
        },
        setLoginCookie: sessions({
            cookieName: "IV_ID", // cookie name dictates the key name added to the request object
            requestKey: "IV_ID",
            secret: "11122ab5-fb03-453f-af6d-c92d7d0f66a7", // should be a large unguessable string
            duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
            activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
            encryptionKey: new Buffer("b8aa30d8f1d398883f0eeb5079777c42"),
            signatureKey: (new Buffer("bs3f3df8f1d3984u5345809348777c41")),
            cookie: { domain:'.ivokio.com'},
        })
    };
};