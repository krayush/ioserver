var miscModel = require('../models/misc');
var miscCollection = require('../collections/misc');
var API_CONFIG = require("../config/appConstants.js");
var connection = require("../config/db");
var queries = require("../config/dbQueries");
var crypto = require("../config/crypto");
var product = require("./product");
var category = require("./category");
var util = require('./util');
var q = require('q');

var getYearFromDate = function (date) {
    return (new Date(date)).getFullYear().toString();
};

module.exports = function(app) {
    return {
        getCompanyHistory: function (req, res) {
            var userData = { }; // No data is required to be sent while making this call
            // Check if valid request is sent by the user
            if(!crypto.validateAuthorization(req, res, userData)) {
                return;
            }
            var data = [];
            connection.query(queries.COMPANY_EVENTS_QUERY, function (err, rows, fields) {
                if (err) {
                    throw err;
                }
                if(!rows || !rows.length) {
                    res.json({
                        data: [],
                        success: false,
                        message: "No rows found"
                    });
                    return;
                }
                var previousYear = getYearFromDate(rows[0]["event_date"]), currentYear, eventData, currentIndex = 0;
                var data = [{
                    heading: previousYear,
                    list: []
                }];
                for(var i = 0; i < rows.length; i++) {
                    currentYear = getYearFromDate(rows[i]["event_date"]);
                    eventData = {
                        image: rows[i].image,
                        eventData: rows[i].description,
                        eventTitle: rows[i].title
                    };
                    if(currentYear === previousYear) {
                        data[currentIndex].list.push(eventData);
                    } else {
                        currentIndex++;
                        previousYear = currentYear;
                        data.push({
                            heading: currentYear,
                            list: []
                        });
                        data[currentIndex].list.push(eventData);
                    }
                }
                var response = {
                    data: data,
                    success: true,
                    message: ""
                };
                res.json(response);
            });
        },
        search: function (req, res) {
            var userResponse;
            var userData = {
                searchParam: req.query.query
            };
            if (!crypto.validateAuthorization(req, res, userData) || !util.checkValidSearchParam(res, userData.searchParam)) {
                return;
            }
            var productSearchPromise = product.search(userData.searchParam);
            var categorySearchPromise = category.search(userData.searchParam);
            q.all([productSearchPromise,categorySearchPromise]).then(function(results) {
                res.send({
                    message: "",
                    success: true,
                    data: {
                        products: results[0][0],
                        categories: results[1][0],
                        query: userData.searchParam
                    }
                });
            }).catch(function (error) {
                res.send({
                    message: "Database error occurred",
                    success: false,
                    error: error
                });
            });
        },
        getFaqSection: function(req, res) {
            var userData = {};
            var data = {};
            // Check if valid request is sent by the user
            if(!crypto.validateAuthorization(req, res, userData)) {
                return;
            }
            connection.query(queries.FAQ_QUERY, function (err, rows, fields) {
                if (err) {
                    throw err;
                }
                if(!rows || !rows.length) {
                    res.json({
                        success: false,
                        message: "No rows found"
                    });
                    return;
                }
                for(var i = 0;i < rows.length; i++) {
                    var id = rows[i].id;
                    if(!data[id]) {
                        data[id] = {
                            name: rows[i].name,
                            image: rows[i].image,
                            rows: []
                        };
                    }
                    data[id].rows.push({
                        question: rows[i].question,
                        answer: rows[i].answer
                    });
                }
                var response = {
                    data: data,
                    success: true,
                    message: ""
                };
                res.json(response);
            });
        }
    };
};

