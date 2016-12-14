var util = require('./util');
var API_CONFIG = require("../config/appConstants.js");
var crypto = require("../config/crypto");
var connection = require("../config/db");
var queries = require("../config/dbQueries");
var q = require('q');

module.exports = {
    getProductsByArray: function(req, res) {
        var userResponse;
		var userData = {
			cartItems: req.query.list
		};
		if (!crypto.validateAuthorization(req, res, userData)) {
			return;
		}
        if(typeof userData.cartItems === "object") {
            userData.cartItems = userData.cartItems.join(",");
        }
        
        if(!(userData.cartItems && /^[0-9 ,]*$/i.test(userData.cartItems))){
    		userResponse = {
                message: "Invalid data provided. Please try again",
                success: false
            };
            res.json(userResponse);
            return;
    	}
		var query = util.replaceAll(queries.GET_PRODUCTS_BY_LIST, "{productList}", userData.cartItems);
		connection.query(query, function(err, rows) {
            if (err) {
                throw err;
            }
            if(rows && rows.length) {
                userResponse = {
                    success: true,
                    data: rows,
                    message: ""
                };
            } else {
                userResponse = {
                    success: false,
                    message: "No rows found"
                };
            }
            res.json(userResponse);
		});
    },
    getProductReviews: function(req, res) {
        var userResponse;
		var userData = {
			productId : req.query.productId
		};
		if (!crypto.validateAuthorization(req, res, userData) || !util.checkIfValidInteger(res, req.query.productId)) {
			return;
		}
		var query = util.replaceAll(queries.GET_PRODUCT_REVIEWS, "{product}", userData.productId);
		connection.query(query, function(err, rows) {
            if (err) {
                throw err;
            }
            if(rows && rows.length) {
                userResponse = {
                    success: true,
                    data: rows,
                    message: ""
                };
            } else {
                userResponse = {
                    success: false,
                    message: "No rows found"
                };
            }
            res.json(userResponse);
		});
    },
    getSuggestions: function (req, res) {
        var userResponse;
		var userData = {
			productId : req.query.productId
		};
		if (!crypto.validateAuthorization(req, res, userData) || !util.checkIfValidInteger(res, req.query.productId)) {
			return;
		}
		var query = util.replaceAll(queries.SAME_CATEGORY_PRODUCTS, "{product}", userData.productId);
		connection.query(query, function(err, rows) {
            if (err) {
                throw err;
            }
            if(rows && rows.length) {
                userResponse = {
                    success: true,
                    data: rows,
                    message: ""
                };
            } else {
                userResponse = {
                    success: false,
                    message: "No rows found"
                };
            }
            res.json(userResponse);
		});
    },
    getPivot: function(req, res) {
        var userData = {
            productId: req.query.productId
        };
        if(!util.checkIfValidInteger(res, userData.productId) || !crypto.validateAuthorization(req, res, userData)) {
            return;
        }
        var query = queries.GET_PRODUCT_PIVOT.replace("{product}", userData.productId);
        connection.query(query, function(err, rows, fields) {
            if (err) {
                throw err;
            }
            var message;
            try {
                if(rows && rows.length) {
                    var data = [];
                    data.push({
                        id: rows[0].p2_categoryId,
                        name: rows[0].p2_categoryName
                    });
                    data.push({
                        id: rows[0].p1_categoryId,
                        name: rows[0].p1_categoryName
                    });
                    data.push({
                        id: rows[0].categoryId,
                        name: rows[0].categoryName
                    });
                    data.push({
                        name: rows[0].productName
                    });
                    res.json({
                        message: "",
                        success: true,
                        data: data
                    });
                    return;
                } else {
                    message = "No data found";
                }
            } catch (e) {
                message = "Database error occurred";
            }
            res.json({
                message: message,
                success: false
            });
        });
    },
    getProductDetails: function (req, res) {
        var currentViewedProducts;
        var userData = {
            productId: req.query.productId
        };
        if (!util.checkIfValidInteger(res, req.query.productId) || !crypto.validateAuthorization(req, res, userData)) {
            return;
        }
        try {
            currentViewedProducts = JSON.parse(new Buffer(req.cookies.viewedProducts, "base64").toString());
        } catch (exception) {
        }
        if(!currentViewedProducts) {
            currentViewedProducts = [];
        }
		var itemDetailsQuery = util.replaceAll(queries.PRODUCT_DETAILS, "{product}", userData.productId);
        var updateViewCountQuery = queries.UPDATE_VIEWS_QUERY.replace("{product}", userData.productId);
		connection.query(itemDetailsQuery, function(err, rows) {
            var userResponse;
			if (err) {
				throw err;
			}
            if(rows && rows.length) {
                userResponse = {
                    success: true,
                    data: rows[0],
                    message: ""
                };
            } else {
                userResponse = {
                    success: false,
                    message: "No rows found"
                };
            }
            if(currentViewedProducts.indexOf(userData.itemId) < 0) {
                currentViewedProducts.push(userData.itemId);
            }
            currentViewedProducts = (new Buffer(JSON.stringify(currentViewedProducts)).toString("base64"));
            res.cookie('viewedItems', currentViewedProducts, { maxAge: 2 * 60 * 60 * 1000});
			res.json(userResponse);
		});
        if(currentViewedProducts.indexOf(userData.itemId) < 0) {
            connection.query(updateViewCountQuery);
        }
	},
    search: function (searchParam) {
        var searchQuery = util.replaceAll(queries.SEARCH_PRODUCT, "{searchParam}", searchParam);
        var deferredSearch = q.defer();
        connection.query(searchQuery, deferredSearch.makeNodeResolver());
        return deferredSearch.promise;
    }
};