var express = require('express');
var userController = require('../controllers/user');
module.exports = (function() {
    var router = express.Router();
    console.log("Reached User Route");
    router.get('/register-session', userController.registerSession);
    router.get('/', function() {

    });
    return router;
})();