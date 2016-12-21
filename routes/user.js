var express = require('express');
var app = express();
var userController = require('../controllers/user');

module.exports = (function() {
    var router = express.Router();
    console.log("Reached User Route");
    router.post('/register-session', userController.registerSession);
    router.post('/end-session', userController.endSession);
    return router;
})();