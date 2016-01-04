/**
 * @File: server.js
 * @author:  Junior Napier
**/
'use strict';
var express        = require('express'),
    mongoose       = require('mongoose'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    app            = express();




// setup and connect to database
var db = require('./server/config/db'),
    config = require('./server/config/config'),
    employee = require('./server/models/employee');

mongoose.connect(db.url, function(err) {
    if(err) {
        console.log('database connection error', err);
    } else {
        console.log('database connection successful');
    }
}); 


app.use(bodyParser.json()); 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));


// view engine setup
app.set('views', './server/views');
app.set('view engine', 'ejs');

//perform route lookup based on url and HTTP method
app.use( app.router );

//load routes for server
require('./server/routes/index')(app); 
require('./server/routes/login')(app); 
require('./server/routes/employees')(app);

//set the public folder of the app
app.use(express.static( './public')); 

//Start server
var port = 3000;
app.listen( port, function() {
    console.log( 'Employee API server listening on port %d in %s mode', port, app.settings.env );
});

// expose app           
exports = module.exports = app;          