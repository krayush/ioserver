var express = require('express');
var userController = require('../controllers/user');
var bodyParser = require('body-parser');
module.exports = (function() {
    var router = express.Router();
    console.log("Reached User Route");
    router.get('/reset-password-link', userController.getForgotPasswordLink);
    router.get('/get-orders-by-user', userController.getOrdersByUser);
    router.get('/get-saved-addresses', userController.getSavedAddresses);
    router.get('/delete-saved-address', userController.deleteSavedAddresses);
    router.get('/save-new-address', userController.saveNewAddress);
    router.get('/edit-address', userController.editAddress);
    return router;
})();