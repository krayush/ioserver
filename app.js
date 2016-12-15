var express = require('express');
var app = express();
//var generic = require('./middlewares/genericCookies');
//var cors = require('./middlewares/cors');
//var API_CONFIG = require("./config/appConstants");
//
// var comet = require('comet.io').createServer();
// comet.on('connection', function (socket) {
//     // do something when a client has connected
//     socket.emit('test.message', {
//         something:'any json object here'
//     });
// });


// Routes section starts here
var serverAppRoutes = require('./routes/user');
app.use('/', serverAppRoutes(app));
//
// var categoryRoutes = require('./routes/category');
// app.use('/category', categoryRoutes);
//
// var bannerRoutes = require('./routes/bannerContent');
// app.use('/banner', bannerRoutes);
//
// var listingRoutes = require('./routes/listing');
// app.use('/listing', listingRoutes);
//
// var productRoutes = require('./routes/product');
// app.use('/product', productRoutes);
//
// var userRoutes = require('./routes/user');
// app.use('/user', userRoutes);
//
// var miscRoutes = require('./routes/misc');
// app.use('/misc', miscRoutes(app));
//
// var authenticationRoutes = require('./routes/authentication');
// app.use('/authentication', authenticationRoutes(app));
//
// var orderRoutes = require('./routes/order');
// app.use('/order', orderRoutes);
//
// // Note: This will always come in the end as it is going to be invoked if no url matches
// // 404 Error handler
// //var error404Routes = require('./middlewares/error404');
// //app.use(error404Routes(app).errorHandler);
//
// // This part needs to handled from gruntfile.js
// var listener = app.listen(5151, function() {
//     console.log("Server running on port - " + listener.address().port);
// });
