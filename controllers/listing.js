var listingModel = require('../models/listing');
var listingCollection = require('../collections/listing');
var API_CONFIG = require("../config/appConstants.js");
var util = require('./util');
var crypto = require("../config/crypto");
var connection = require("../config/db");
var queries = require("../config/dbQueries");
var q = require('q');

module.exports = {
    getCategoryProducts: function(req, res) {
        if(!util.checkIfValidInteger(res, req.query.categoryId) || !crypto.validateAuthorization(req, res, userData)) {
            return;
        }
        var userData;
        try {
            userData = {
                categoryId: req.query.categoryId,
                filter: JSON.parse(req.query.filter || null)
            };
        } catch(e) {
            // As using a regex didn't work
            res.json({
                message: "Invalid data provided",
                success: false
            });
            return;
        }
        var whereString = "";
        if(userData.filter) {
            if(userData.filter.brand && userData.filter.brand.length) {
                if(!util.checkValidQueryParam(res, userData.filter.brand)) {
                    return;
                }
                whereString += " AND brand IN('" + userData.filter.brand.join("','") + "')";
            }
            if(userData.filter.rent) {
                var range = userData.filter.rent.split("##");
                if(!range[0] || !range[1] || !util.checkOnlyNumbers(res, range[0]) || !util.checkOnlyNumbers(res, range[1])) {
                    return;
                }
                range[0] = range[0].substr(0,5);
                range[1] = range[1].substr(0,5);
                whereString += " AND rent >= " + range[0] + " AND min(rent) <= " + range[1];
            }
        }
        var query = util.replaceAll(queries.GET_PRODUCTS + whereString, "{category}", req.query.categoryId);
        connection.query(query, function(err, rows, fields) {
            if (err) {
                throw err;
            }
            if(rows && rows.length && rows[0].id) {
                res.json({
                    message: "",
                    success: true,
                    data: rows
                });
            } else {
                res.json({
                    message: "No data found",
                    success: true,
                    data: []
                });
            }
        });
    },
    getFilters: function(req, res) {
        if(!util.checkIfValidInteger(res, req.query.categoryId) || !crypto.validateAuthorization(req, res, userData)) {
            return;
        }
        var userData = {
            categoryId: req.query.categoryId
        };
        var priceQuery = util.replaceAll(queries.GET_RENT_RANGE, "{category}", userData.categoryId);
        var brandQuery = util.replaceAll(queries.GET_BRAND_RANGE, "{category}", userData.categoryId);
        var linksQuery = util.replaceAll(queries.GET_QUICK_LINKS, "{category}", userData.categoryId);
        var subCatQuery = util.replaceAll(queries.GET_CHILD_CATEGORIES, "{category}", userData.categoryId);
        var deferredPrice = q.defer();
        connection.query(priceQuery, deferredPrice.makeNodeResolver());
        var deferredBrand = q.defer();
        connection.query(brandQuery, deferredBrand.makeNodeResolver());
        var deferredQuickLinks = q.defer();
        connection.query(linksQuery, deferredQuickLinks.makeNodeResolver());
        var deferredSubCategories = q.defer();
        connection.query(subCatQuery, deferredSubCategories.makeNodeResolver());
        
        q.all([
            deferredPrice.promise,
            deferredBrand.promise,
            deferredQuickLinks.promise,
            deferredSubCategories.promise
        ]).then(function(results) {
            var data = [];
            var heading = "";
            if(results[3][0].length) {
                heading = results[3][0][0].parent;
                if(results[3][0][0].id) {
                    data.push({
                        type: API_CONFIG.FILTERS.HIERARCHY,
                        filterHeading: heading,
                        items: results[3][0]
                    });
                }
            }
            data.push({
                type: API_CONFIG.FILTERS.ITEM_LIST,
                filterHeading: "Quick links",
                items: results[2][0]
            });
            data.push({
                type: API_CONFIG.FILTERS.CHECK_SEARCHABLE,
                filterHeading: "Brand",
                filterKey: "brand",
                items: results[1][0]
            }); 
            data.push({
                type: API_CONFIG.FILTERS.SLIDER,
                filterHeading: "Rent",
                filterKey: "rent",
                items: results[0][0]
            });
            res.send({
                message: "",
                success: true,
                data: data
            });
        }).catch(function (error) {
            res.send({
                message: "Database error occurred",
                success: false,
                error: error
            });
        });
    },
    getPivot: function (req, res) {
        var userData = {
            categoryId: req.query.categoryId
        };
        if(!util.checkIfValidInteger(res, userData.categoryId) || !crypto.validateAuthorization(req, res, userData)) {
            return;
        }
        var query = queries.GET_CATEGORY_PIVOT.replace("{category}", userData.categoryId);
        connection.query(query, function(err, rows, fields) {
            if (err) {
                throw err;
            }
            var message;
            try {
                if(rows && rows.length) {
                    var data = [];
                    if(rows[0].p2_categoryId){
                        data.push({
                            id: rows[0].p2_categoryId,
                            name: rows[0].p2_categoryName
                        });
                    }
                    if(rows[0].p1_categoryId) {
                        data.push({
                            id: rows[0].p1_categoryId,
                            name: rows[0].p1_categoryName
                        });
                    }
                    data.push({
                        id: rows[0].categoryId,
                        name: rows[0].categoryName
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
    }
};