var express = require('express');
var app = express();
var userController = require('../controllers/publish');

module.exports = function(io) {
    var router = express.Router();
    console.log("Reached Publish Route");
    router.post('/', userController.publish(io));
    return router;
};