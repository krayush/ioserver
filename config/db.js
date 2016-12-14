var mysql = require('mysql');

var environment = (function (env) {
    var config = {};
    switch (env) {
        case 'production':
            config = require('../env/production');
            break;
        case 'development':
            config = require('../env/development');
            break;
        case 'testing':
            config = require('../env/testing');
            break;
        case 'staging':
            config = require('../env/staging');
            break;
        default:
            console.log("No NODE_ENV environment variable provided. Server Default: Production");
            config = require('../env/production');
    }
    return config;
})(process.env.NODE_ENV);

var connection = mysql.createConnection(environment.dbConfig);
connection.connect();
module.exports = connection;