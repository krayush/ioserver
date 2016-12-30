var express = require('express');
var app = express();
var cors = require('./middlewares/cors');
var bodyParser = require('body-parser');
var appConstants = require('./config/appConstants');
var subscribe = require('./controllers/subscribe');

app.use(cors);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Note: This will always come in the end as it is going to be invoked if no url matches
// 404 Error handler
// var error404Routes = require('./middlewares/error404');
// app.use(error404Routes(app).errorHandler);

// This part needs to handled from gruntfile.js
var listener = app.listen(appConstants.ioServerPort, function() {
    console.log("Server running on port - " + listener.address().port);
});

// Start subscriber to listen for connections from UI client
var io = require('socket.io').listen(listener);
subscribe(io);

// Routes section
var userRoutes = require('./routes/user');
app.use('/user', userRoutes);

var publishRoutes = require('./routes/publish');
app.use('/publish', publishRoutes(io));
