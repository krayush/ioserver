var API_CONFIG = require("../config/appConstants.js");
var express = require('express');
var handlebars = require('express-handlebars').create({ defaultLayout:'main' });
var userController = require("./user");
var q = require('q');

module.exports = function(app) {
    return {
        getHomePage: function (req, res) {
            app.engine('handlebars', handlebars.engine);
            app.set('view engine', 'handlebars');
            if(req.IV_ID.userLoggedIn && req.IV_ID.userEmail) {
                userController.getUserDetails(req.IV_ID.userEmail).then(function(rows) {
                    if(rows && rows.length) {
                        var row = rows[0][0];
                        var userData = {
                            fullName: row.full_name,
                            email: row.email,
                            mobile: row.mobile,
                            address: row.address,
                            city: row.city,
                            state: row.state,
                        };
                        res.render('index', {userDetails: JSON.stringify(userData)});
                    } else {
                        res.render('index', {userDetails: ""});
                    }
                }, function(err) {
                    res.render('index', {userDetails: ""});
                });
            } else {
                res.render('index', {userDetails: ""});
            }
        }
    };
};

//if(process.env.NODE_ENV === "development") {
//    res.render('index', {cdnUrl: API_CONFIG.LOCAL_CDN_URL});
//} else {
//    res.render('index', {cdnUrl: API_CONFIG.PUBLIC_CDN_URL});
//}