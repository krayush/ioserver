var bannerModel = require('../models/bannerContent');
var bannerCollection = require('../collections/bannerContent');
var API_CONFIG = require("../config/appConstants");
var crypto = require("../config/crypto");
var connection = require("../config/db");
var queries = require("../config/dbQueries");

module.exports = {
    getTopBannerImageData: function(req, res) {
        var userData = {};
        // Check if valid request is sent by the user
        if(!crypto.validateAuthorization(req, res, userData)) {
            return;
        }
        var query = queries.TOP_BANNER_DATA;
        connection.query(query, function(err, rows, fields) {
            if (err) {
                throw err;
            }
            res.json({
                data: rows,
                success: true,
                message: ""
            });
        });
    },
    getEightImageBanner: function(req, res) {
        var userData = {};
        // Check if valid request is sent by the user
        if(!crypto.validateAuthorization(req, res, userData)) {
            return;
        }
        var query = queries.EIGHT_IMAGE_DATA;
        connection.query(query, function(err, rows, fields) {
            if (err) {
                throw err;
            }
            res.json({
                data: rows,
                success: true,
                message: ""
            });
        });
    },
    getThreeImageData: function (req, res) {
        var userData = {};
        // Check if valid request is sent by the user
        if(!crypto.validateAuthorization(req, res, userData)) {
            return;
        }
        var query = queries.THREE_IMAGE_DATA;
        connection.query(query, function(err, rows, fields) {
            if (err) {
                throw err;
            }
            res.json({
                data: rows,
                success: true,
                message: ""
            });
        });
    },
    getWideBanner: function (req, res) {
        // This is the one with only a button inside a while banner
        var userData = {};
        // Check if valid request is sent by the user
        if(!crypto.validateAuthorization(req, res, userData)) {
            return;
        }
        var query = queries.WIDE_BANNER_DATA;
        connection.query(query, function(err, rows, fields) {
            if (err) {
                throw err;
            }
            res.json({
                data: rows,
                success: true,
                message: ""
            });
        });
    },
    getCategoryListBanner: function(req, res) {
        var userData = {};
        if(!crypto.validateAuthorization(req, res, userData)) {
            return;
        }
        var data = {};
        var query = queries.CATEGORY_LIST;
        connection.query(query, function(err, rows, fields) {
            if (err) {
                throw err;
            }
            if(rows.length) {
                var tabListQuery = queries.CATEGORY_TABS.replace("{{id}}", rows[0].banner_id);
                data.bannerHeading = rows[0].banner_title;
                data.categoryList = rows;
                connection.query(tabListQuery, function(err, tabRows, fields) {
                    if (err) {
                        throw err;
                    }
                    data.tabList = tabRows;
                    data.adData = [];
                    res.json({
                        data: data,
                        success: true,
                        message: ""
                    });
                });
            }
        });
    },
    getDetailBanner: function(req, res) {
        var userData = {};
        // Check if valid request is sent by the user
        if(!crypto.validateAuthorization(req, res, userData)) {
            return;
        }
        var data = {};
        var query = queries.DETAILED_BANNER;
        connection.query(query, function(err, rows, fields) {
            if (err) {
                throw err;
            }
            if(rows.length) {
                var quickLinksQuery = queries.DETAILED_CATEGORY_LIST;
                data.bannerHeading = rows[0].banner_title;
                data.images = rows;
                connection.query(quickLinksQuery, function(err, tabRows, fields) {
                    if (err) {
                        throw err;
                    }
                    var half = parseInt(tabRows.length / 2);
                    data.categoryList = tabRows.slice(0, half);
                    data.verticalQuickLinks = tabRows.slice(half, tabRows.length);
                    res.json({
                        data: data,
                        success: true,
                        message: ""
                    });
                });
            }
        });
    }
};