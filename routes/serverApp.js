var express = require('express');
var serverAppController = require('../controllers/serverApp');
module.exports = function (app) {
    var router = express.Router();
    router.get('/', serverAppController(app).getHomePage);
    return router;
};