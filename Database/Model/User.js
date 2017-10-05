var db = require('../config');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var Movie=require('./Movie')

//create our user model 
var userSchema = mongoose.Schema({
	id: Number,
	username: { type: String, required: true, index: { unique: true } },
	password: { type: String, required: true },
	movies:[{type:mongoose.Schema.Types.ObjectId,ref:'Movie'}]
});

var User = mongoose.model('User' , userSchema);


module.exports = User;



