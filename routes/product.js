var express = require('express');
var productController = require('../controllers/product');
var bodyParser = require('body-parser');
module.exports = (function () {
    var router = express.Router();
    console.log("Reached Product Route");
    router.use(bodyParser.json());
    //router.get('/get-features', productController.getFeatures);
    router.get('/get-suggestions', productController.getSuggestions);
    router.get('/get-product-details', productController.getProductDetails);
    router.get('/get-pivot', productController.getPivot);
    router.get('/get-product-reviews', productController.getProductReviews);
    router.get('/get-products-by-array', productController.getProductsByArray);
    return router;
})();