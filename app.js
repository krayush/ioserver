var express = require('express');
var app = express();
var cors = require('./middlewares/cors');
var bodyParser = require('body-parser');


// using cors
app.use(cors);
// Using bodyParser for post requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes section starts here
var userRoutes = require('./routes/user');
app.use('/user', userRoutes);

// var comet = require('comet.io').createServer();
// comet.on('connection', function (socket) {
//     // do something when a client has connected
//     socket.emit('test.message', {
//         something:'any json object here'
//     });
// });


// // Note: This will always come in the end as it is going to be invoked if no url matches
// // 404 Error handler
// //var error404Routes = require('./middlewares/error404');
// //app.use(error404Routes(app).errorHandler);

// This part needs to handled from gruntfile.js
var listener = app.listen(5151, function() {
    console.log("Server running on port - " + listener.address().port);
});





