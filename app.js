var express = require('express');
var app = express();
var generic = require('./middlewares/genericCookies');
var cors = require('./middlewares/cors');
var API_CONFIG = require("./config/appConstants");
var sm = require('sitemap');


var sitemap = sm.createSitemap ({
    hostname: 'http://www.ivokio.com',
    cacheTime: 600000,
    urls: [
        { url: '/about-ivokio',  changefreq: 'daily', priority: 0.3 },
        { url: '/core-values/',  changefreq: 'monthly',  priority: 0.7 },
        { url: '/contact-us/'},
    ]
});

app.get('/sitemap.xml', function(req, res) {
    sitemap.toXML( function (err, xml) {
        if (err) {
            return res.status(500).end();
        }
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    });
});

// Redirect ivokio.com to www.ivokio.com
app.get ('/*', function (req, res, next){
    var protocol = 'http' + (req.connection.encrypted ? 's' : '') + '://', host = req.headers.host, href;
    // no www. present or hit coming from localhost, nothing to do here
    if (/^www\./i.test(host) || host.toLowerCase().indexOf("localhost") > -1) {
        next();
        return;
    }
    host = 'www.' + host;
    href = protocol + host + req.url;
    res.statusCode = 301;
    res.setHeader('Location', href);
    res.write('Redirecting to ' + host + req.url + '');
    res.end();
});

// Disabling the exposing of Server Info
app.disable('x-powered-by');
app.use(cors);

// Integrating the cookie parser package for reading cookies easily
var cookieParser = require('cookie-parser');
app.use(cookieParser(API_CONFIG.APP_SECRET));

app.use(generic(app).setProductsCookie);

// Setting
var authentication = require('./middlewares/authentication');
app.use(authentication(app).setLoginCookie);
app.use(authentication(app).validateLogin);

// Routes section starts here
var serverAppRoutes = require('./routes/serverApp');
app.use('/', serverAppRoutes(app));

var categoryRoutes = require('./routes/category');
app.use('/category', categoryRoutes);

var bannerRoutes = require('./routes/bannerContent');
app.use('/banner', bannerRoutes);

var listingRoutes = require('./routes/listing');
app.use('/listing', listingRoutes);

var productRoutes = require('./routes/product');
app.use('/product', productRoutes);

var userRoutes = require('./routes/user');
app.use('/user', userRoutes);

var miscRoutes = require('./routes/misc');
app.use('/misc', miscRoutes(app));

var authenticationRoutes = require('./routes/authentication');
app.use('/authentication', authenticationRoutes(app));

var orderRoutes = require('./routes/order');
app.use('/order', orderRoutes);

// Note: This will always come in the end as it is going to be invoked if no url matches
// 404 Error handler
//var error404Routes = require('./middlewares/error404');
//app.use(error404Routes(app).errorHandler);

// This part needs to handled from gruntfile.js
var listener = app.listen(5151, function() {
    console.log("Server running on port - " + listener.address().port);
});
