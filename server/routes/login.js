/**
 * @File: server/routes/login.js
 * @author:  Junior Napier
**/
'use strict';
var express = require('express'),
    passport = require('passport'),
    router = express.Router();

module.exports = function(app) {

    app.get('/login', function(req, res, next) {
        console.log("Login route");
        res.render('login', { 
        	title: 'Employee application login (ADP)', 
        	user: req.user
        });
    });

    app.post('/login',
        passport.authenticate('local', { 
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true 
        })
    )
};

