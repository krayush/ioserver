var express = require('express');
var authController = require('../controllers/authentication');
module.exports = function (app) {
    var router = express.Router();
    console.log("Reached Login Route");
    router.get('/login', authController(app).login);
    router.get('/subscribe', authController(app).subscribe);
    router.get('/register', authController(app).register);
    router.get('/validate-fb-login', authController(app).validateFBLogin);
    router.get("/validate-google-login", authController(app).validateGoogleLogin);
    router.get('/authenticate', authController(app).authenticateForgotPassword);
    router.get('/set-new-password', authController(app).setNewPassword);
    return router;
};