var express = require('express');
var categoryController = require('../controllers/category');
module.exports = (function () {
    var router = express.Router();
    console.log("Reached Category Route");
    router.get("/get-categories", categoryController.getCategories);
    return router;
})();