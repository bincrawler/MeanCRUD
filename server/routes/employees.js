/**
 * @File: server/routes/employees.js
 * @author:  Junior Napier
**/
'use strict';

var bodyParser     = require('body-parser'),
    methodOverride = require('method-override');

var employeeController = require('../controllers/employees');

module.exports = function(app) {


	app.use(bodyParser.urlencoded({ extended: true }))

	app.use(methodOverride(function(req, res){
	    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
	        // look in urlencoded POST bodies and delete it
	        var method = req.body._method
	        delete req.body._method
	        return method
	    }
	}));

	//GET employees
	app.get('/employee', employeeController.requiresLogin, employeeController.getAllEmployees); 
	app.get('/employee/:employeeId', employeeController.requiresLogin, employeeController.getEmployee);

	//POST create an employee
	app.post('/employee', employeeController.requiresLogin, employeeController.createEmployee);

	//PUT update an employee
	app.put('/employee/:employeeId', employeeController.requiresLogin, employeeController.updateEmployee);

	//DELETE a new employees
	app.delete('/employee/:employeeId', employeeController.requiresLogin, employeeController.deleteEmployee);
};
