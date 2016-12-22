var express = require('express');
var app = express();
var userController = require('../controllers/publish');

module.exports = (function() {
    var router = express.Router();
    console.log("Reached Publish Route");
    router.get('/', userController.publish);
    return router;
})();