/**
 * @File: server/controllers/employees.js
 * @author:  Junior Napier
**/
'use strict';

var mongoose = require('mongoose'),
    Employees = mongoose.model('Employee'),
    lodash =  require('lodash'),
    config = require(__dirname + '/../../server/config/config');

module.exports.requiresLogin = function(req, res, next) {
    // simple preshared secret api...
    // each api would require an additional option 
    //
    //    url/?sessionSecret=ADP
    //
    
  if ((!req.query.sessionSecret) || (req.query.sessionSecret!==config.sessionSecret)) {
    return res.status(403).json({
        success: false,
        message: 'User is not logged in, Pre Shared Secrete not provided'
    });
  } else {
    console.log("requiresLogin: Pre Shared Secrete provided...");
  }

  next();
};

module.exports.getAllEmployees = function(req, res) {
    
    console.log("Getting  list of employees...");

    return Employees.find(function( err, employee ) {
        if( !err ) {
            return res.json( employee );
        } else {
            err.success = false;
            return res.json(err);
        }
    });
}


module.exports.getEmployee = function(req, res) {

    console.log("Getting  an employee... ", req.params, req.body);

    return Employees.findById( req.params.employeeId, function( err, employee ) {
        
        if (!employee) {
            // did not find employee
            return res.status(404).json({success: false, message: "Employee "+req.params.employeeId+" not found"});
        } 

        if( !err ) {
            return res.json( employee );
        } else {
            err.success = false;
            return res.json(err);
        }
    });
};


module.exports.createEmployee = function( req, res ) {
    var employee = new Employees(req.body);
    
    console.log("Creating Employee ", req.body);

    // clear id fields for new employee creation. MongoDB will provide :)
    delete(employee._id);
    delete(employee.id);
    employee.created_at = (new Date()).toISOString();
    employee.updated_at = (new Date()).toISOString();

    employee.save( function( err, newemployee ) {
        if( !err ) {
            console.log( 'Employee ', newemployee._id, ", ", newemployee.name, " created.", err);
            return res.json( newemployee );
        } else {
            err.success = false;
            err.newemployee = newemployee;
            return res.json( err );
        }
    });
};


module.exports.updateEmployee = function(req, res) {

    console.log("Updating an employee...", req.params);

    return Employees.findById( req.params.employeeId, function( err, employee ) {

        if (!employee) {
            // did not find employee to update
            return res.status(404).json({success: false, message: "Employee "+req.params.employeeId+" not found"});
        } 

        employee = lodash.extend(employee, req.body);

        delete(employee.created_at);
        employee.updated_at = (new Date()).toISOString();

        return employee.save( function( err ) {
            if( !err ) {
                console.log( 'employee %s updated',  req.params.employeeId );
                return res.json( employee );
            } else {
                err.success = false;
                return res.json(err);
            }
        });
    });
};


module.exports.deleteEmployee = function(req, res) {

    console.log("Deleting  an employee...", req.params);

    Employees.findById( req.params.employeeId, function( err, employee ) {
        if (!employee) {
            // did not find employee to delete
            return res.status(404).json({success: false, message: "Employee "+req.params.employeeId+" not found"});
        }
        return employee.remove( function( err ) {
            if( !err ) {
                console.log( 'Employee %s, %s removed ', employee._id, employee.name);
                return res.json( employee );
            } else {
                err.success = false;
                return res.json(err);
            }
        });
    });
};