var express = require('express');
var orderController = require('../controllers/order');
var bodyParser = require('body-parser');

module.exports = (function (app) {
    var router = express.Router();
    console.log("Reached order Route");
	router.use(bodyParser.json());
	router.post('/place', orderController.placeOrder);
	router.get('/cancel', orderController.cancelOrder);
    router.get('/get-details', orderController.getOrderDetails);
    return router;
})();