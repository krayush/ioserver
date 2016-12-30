var sessionTokens = require('../models/sessionTokens')();
var appConstants = require("../config/appConstants");

module.exports = function(io) {
    io.on("connection", function(client) {
        try {
            var requestData = JSON.parse(client.request._query.requestData);
            if(sessionTokens[requestData.appKey][requestData.sessionToken]) {
                sessionTokens[requestData.appKey][requestData.sessionToken].sessionInstance = client;
                sessionTokens[requestData.appKey][requestData.sessionToken].subscriptionDate = new Date().getTime();
                client.emit("subscription-complete", { successful: true });
            } else {
                client.emit("subscription-complete", {
                    successful: false,
                    message: appConstants.messages.noValidSession
                });
            }
        } catch(e) {
            client.emit("subscription-complete", {
                successful: false,
                message: appConstants.messages.invalidDataFromClient
            });
        }
    });
};