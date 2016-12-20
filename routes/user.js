var express = require('express');
var handlebars = require('express-handlebars').create({ defaultLayout:'main' });


var userController = require('../controllers/user');
var path = require('path');

module.exports = function(app) {
    var router = express.Router();
    app.engine('handlebars', handlebars.engine);
    app.set('view engine', 'handlebars');
    router.get('/',function (req, res) {
    	userData = {

    	};
	    res.render('user', {userDetails: JSON.stringify(userData)});   
    });


    router.get('/register-session', userController.registerSession);
    return router;
};