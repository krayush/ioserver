var appConstants = require('../config/appConstants');
var traverse = require('traverse');
var sessionTokens;
var initSessionTokens = function() {
    sessionTokens = {};
}
module.exports = function() {
    if(!sessionTokens) {
        initSessionTokens();
        traverse(appConstants.appKeys).map(function (key) {
            if(this.isLeaf) {
                sessionTokens[this.key] = {};
            }
        });
    }
    return sessionTokens;
};