var express = require('express');
var listingController = require('../controllers/listing');
module.exports = (function () {
    var router = express.Router();
    console.log("Reached Listing Route");
    //router.get('/get-category-products/:count', listingController.getCategoryProducts);
    router.get('/get-category-products', listingController.getCategoryProducts);
    router.get('/get-filters', listingController.getFilters);
    router.get('/get-pivot', listingController.getPivot);
    return router;
})();