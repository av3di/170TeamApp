
var Mongoose = require('mongoose');


var UserSchema = new Mongoose.Schema({
  // fields are defined here
  'username': String,
  'email': String,
  'password': String,
  'notes': [{
	'class': String,
	'note': String
  }]
});

exports.User = Mongoose.model('User', UserSchema);


