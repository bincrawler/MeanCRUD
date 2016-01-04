/**
 * @File: server/routes/index.js
 * @author:  Junior Napier
**/
'use strict';
var express = require('express'),
    router = express.Router();

module.exports = function(app) {

    app.get('/', function(req, res, next) {
        res.render('index', { 
        	title: 'Employee application (ADP)', 
        	user: {} 
        });
    });

};

