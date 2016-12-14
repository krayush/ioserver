var util = require('./util');
var crypto = require("../config/crypto");
var connection = require("../config/db");
var queries = require("../config/dbQueries");
//var q = require('q');
module.exports = {
    placeOrder: function (req, res) {
        var userResponse;
        if(!(req.IV_ID.userLoggedIn && req.IV_ID.userEmail && req.IV_ID.userId)) {
            userResponse = {
                message: "User not logged in",
                success: false
            };
            res.json(userResponse);
            return;
        }
        var userData = {
            address: req.body.address,
            productList: req.body.productList
        };
        if(!crypto.validateAuthorization(req, res, userData)) {
            return;
        }
        if(userData.productList.length < 1) {
            userResponse = {
                message: "Invalid data provided",
                success: false
            };
            res.json(userResponse);
            return;
        }
        var query = queries.PLACE_ORDER.replace("{renter_id}", userData.renter_id).replace("{address}", userData.address);
        connection.query(query, function(err, result) {
            if (err) {
                userResponse = {
                    message: "Unable to place Order at the moment",
                    success: false
                };
                res.json(userResponse);
                return;
            }
            var orderMappingQuery = query.INSERT_ITEM_MAPPING;
            for(var i = 0;i < userData.productList.length; i++) {
                var product = userData.productList[i];
                if(i) {
                    orderMappingQuery += ",";
                }
                orderMappingQuery += "(" + result.insertId + ", " + product.productId + ", " + product.rentedForMonths + ", (SELECT rent from products where id = "+ product.productId+"))";
            }
            connection.query(orderMappingQuery, function(err, result) {
                if(err) {
                    userResponse = {
                        message: "Unable to place Order at the moment",
                        success: false
                    };
                } else {
                    userResponse = {
                        message: "",
                        success: true,
                        data: result
                    };
                }
                res.json(userResponse);
            });
        });
    },
    cancelOrder: function (req, res) {
        var userResponse;
        if(!(req.IV_ID.userLoggedIn && req.IV_ID.userEmail && req.IV_ID.userId)) {
            userResponse = {
                message: "User not logged in",
                success: false
            };
            res.json(userResponse);
            return;
        }
        var userData = {
            orderId: req.query.orderId
        };
        if(!crypto.validateAuthorization(req, res, userData) || !util.checkIfValidInteger(res, userData.orderId)) {
            return;
        }
        var query = queries.CANCEL_ORDER.replace("{orderId}", userData.orderId).replace("{renter_id}", req.IV_ID.userId);
        connection.query(query, function(err, result) {
            if(err || result.affectedRows === 0) {
                userResponse = {
                    message: "Unable to cancel order at the moment",
                    success: false
                };
            } else {
                userResponse = {
                    message: "Order cancelled successfully",
                    success: true
                };
            }
            res.json(userResponse);
        });
    },
    getOrderDetails: function(req, res) {
        var userResponse;
        if(req.IV_ID.userLoggedIn && req.IV_ID.userEmail && req.IV_ID.userId) {
            userResponse = {
                message: "User session already exists",
                success: false
            };
            res.json(userResponse);
            return;
        }
        var userData = {
            orderId: req.query.orderId,
            userEmail: req.query.userEmail
        };
        if(!crypto.validateAuthorization(req, res, userData) || !util.checkIfValidEmail(userData.userEmail, res) || !util.checkIfValidInteger(res, userData.orderId)) {
            return;
        }
        var query = queries.GET_ORDER_DETAILS.replace("{orderId}", userData.orderId).replace("{userEmail}", userData.userEmail);
        connection.query(query, function(err, rows) {
            if (err) {
                throw err;
            }
            if(rows.length > 1) {
                userData = {
                    status: rows[0].status,
                    orderId: rows[0].orderId,
                    deliveryAddress: rows[0].deliveryAddress,
                    orderTime: rows[0].orderTime,
                    products: rows
                };
                userResponse = {
                    message: "",
                    success: true,
                    data: userData
                };
            } else {
                userResponse = {
                    message: "Order details not found.",
                    success: false
                };
            }
            res.json(userResponse);
        });
    }
};