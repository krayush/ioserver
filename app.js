var express = require('express');
var app = express();
var cors = require('./middlewares/cors');
var bodyParser = require('body-parser');
var sessionInstances = require('./models/sessionTokens')();

// using cors
app.use(cors);
// Using bodyParser for post requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes section starts here
var userRoutes = require('./routes/user');
app.use('/user', userRoutes);

var publishRoutes = require('./routes/publish');
app.use('/publish', publishRoutes);

// // Note: This will always come in the end as it is going to be invoked if no url matches
// // 404 Error handler
// //var error404Routes = require('./middlewares/error404');
// //app.use(error404Routes(app).errorHandler);

// This part needs to handled from gruntfile.js
var listener = app.listen(5151, function() {
    console.log("Server running on port - " + listener.address().port);
});

var io = require('socket.io').listen(listener);
io.on('connection', function(client) {
    try {
        var requestData = JSON.parse(client.request._query.requestData);
        sessionInstances[requestData.sessionToken] = client;
    } catch(e) {
        console.error("Connection failed for data: ", client.request._query.requestData);
    }
});




