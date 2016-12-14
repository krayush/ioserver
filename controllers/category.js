var util = require('./util');
var crypto = require("../config/crypto");
var connection = require("../config/db");
var queries = require("../config/dbQueries");
var q = require('q');

module.exports = {
    getCategories: function (req, res) {
        var userData = {};
        if(!crypto.validateAuthorization(req, res, userData)) {
            return;
        }
        var query = queries.CATEGORY_FETCH;
        connection.query(query, function(err, rows, fields) {
            var finalData = [];
            var parentTempObj = {};
            var tempObj = {}, i, userResponse;
            if (err) {
                throw err;
            }
            if(rows && rows.length) {
                for(i = 0; i < rows.length; i++) {
                    if(!rows[i]["parent_category_id"]) {
                        rows[i].subCategories = [];
                        parentTempObj[rows[i].id] = rows[i];
                        finalData.push(rows[i]);
                    } else {
                        break;
                    }
                }
                for(; i < rows.length; i++) {
                    if(tempObj[rows[i].parent_category_id]) {
                        break;
                    } else {
                        rows[i].subCategories = [];
                        parentTempObj[rows[i].parent_category_id].subCategories.push(rows[i]);
                        tempObj[rows[i].id] = rows[i];
                    }
                }
                parentTempObj = tempObj;
                tempObj = {};
                for(; i < rows.length; i++) {
                    if(tempObj[rows[i].parent_category_id]) {
                        break;
                    } else {
                        parentTempObj[rows[i].parent_category_id].subCategories.push(rows[i]);
                        tempObj[rows[i].id] = rows[i];
                    }
                }
                userResponse = {
                    message: "",
                    success: true,
                    data: finalData
                };
            } else {
                userResponse = {
                    message: "No rows available in database",
                    success: false,
                    data: []
                };
            }
            res.json(userResponse);
        });
    },
    search: function (searchParam) {
        var searchQuery = util.replaceAll(queries.SEARCH_CATEGORY, "{searchParam}", searchParam);
        var deferredSearch = q.defer();
        connection.query(searchQuery, deferredSearch.makeNodeResolver());
        return deferredSearch.promise;
    }
};