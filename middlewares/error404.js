module.exports = function(app) {
    var express = require('express');
    var handlebars = require('express-handlebars').create({ defaultLayout:'main' });
    return {
        errorHandler: function(req, res, next){
            app.engine('handlebars', handlebars.engine);
            app.set('view engine', 'handlebars');
            res.status(404);
            // respond with html page
            if (req.accepts('html')) {
                res.render("404", { url: req.url });
                return;
            }
            // respond with json
            if (req.accepts('json')) {
                res.send({ error: 'Not found' });
                return;
            }
            // default to plain-text. send()
            res.type('txt').send('Not found');
        }
    };
};