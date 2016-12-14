var express = require('express');
var miscController = require('../controllers/misc');
module.exports = function (app) {
    var router = express.Router();
    console.log("Reached Misc Route");
    router.get('/get-company-history', miscController(app).getCompanyHistory);
    router.get('/get-faq', miscController(app).getFaqSection);
    router.get('/search', miscController(app).search);
    return router;
};