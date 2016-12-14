var sessions = require("client-sessions");
var express = require('express');

module.exports = function(app) {
    return {
        setProductsCookie: function (req, res, next) {
            if(!req.cookies.viewedProducts) {
                var key = new Buffer(JSON.stringify([])).toString("base64");
                res.cookie('viewedProducts', key, { maxAge: 1 * 60 * 60 * 1000});
            }
            next();
        }
    };
};