/**
 * @File: server/models/employee.js
 * @author:  Junior Napier
**/

'use strict';
var mongoose = require('mongoose'),
    employeeSchema = new mongoose.Schema({
       "name":       {type: String, default: '', trim: true, required: true},
       "phone":      {type: String, default: '', trim: true},
       "title":      {type: String, default: '', trim: true},
       "manager_id": {type: mongoose.Schema.ObjectId, ref: 'Employee'},  // reference to Employee's Manager
       "address":    {type: String, default: '', trim: true},
       "status":     {type: Boolean, default: false, trim: true},
       "created_at": {type: Date, default: Date.now },
       "updated_at": {type: Date, default: Date.now }
    });

/**
 * Statics
 */
employeeSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('Manager', 'name phone title').exec(cb);
};


module.exports = mongoose.model('Employee', employeeSchema);
