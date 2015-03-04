var user = require('./user.js');
var models = require('../models');

var current_version = "my_notes";

exports.viewnotes = function(req, res) {
	console.log("User is " + user.current_user.username);
	var random_num = Math.random();
	if(random_num > 0.5) {
		current_version = "my_notes";
		res.render('my_notes', {
			'notes': user.current_user.notes
		});
	}
	else {
		current_version = "my_notes2";
		res.render('my_notes2', {
			'notes': user.current_user.notes
		});
	}
};

exports.addnote =  function(req, res) {
	var index = 0;
	while(index < user.current_user.notes.length)
	{
		if(req.body.class == user.current_user.notes[index].class)
		{
			if(user.current_user.notes[index].note) // check if string is not null
				user.current_user.notes[index].note = user.current_user.notes[index].note + " " + req.body.text;
			else // there are no notes for this class yet.
				user.current_user.notes[index].note = req.body.text;
			break;
		}
		index++;
	}
	var mykey = "notes." + index + ".note";
	var myvalue = user.current_user.notes[index].note;
	var update = {$set: {}};
	update.$set[mykey] = myvalue;
	models.User.update({"username": user.current_user.username}, update).exec(afterAdd);
	function afterAdd(err) {
		if(err) { console.log(err); }
		console.log("Added a note.");
		if(random_num > 0.5) {
			res.render(current_version, {
			'username': user.current_user.username,
			'notes': user.current_user.notes
			});
		}
	};
};

exports.pullnote = function(req, res) {
	user.current_class_i = 0;
	while(user.current_class_i < user.current_user.notes.length)
	{
		if(req.body.class == user.current_user.notes[user.current_class_i].class)
		{
			break;
		}
		user.current_class_i++;
	}
	res.render(current_version, {
			'username': user.current_user.username,
			'notes': user.current_user.notes,
			'update_note': user.current_user.notes[user.current_class_i].note
	});
};

exports.updatenote = function(req, res) {
	user.current_user.notes[user.current_class_i].note = req.body.text;
	var mykey = "notes." + user.current_class_i + ".note";
	var myvalue = user.current_user.notes[user.current_class_i].note;
	var update = {$set: {}};
	update.$set[mykey] = myvalue;
	models.User.update({"username": user.current_user.username}, update).exec(afterAdd);
	function afterAdd(err) {
		if(err) { console.log(err); }
		console.log("Added a note.");
		res.render(current_version, {
		'username': user.current_user.username,
		'notes': user.current_user.notes,
		'update_note': user.current_user.notes[user.current_class_i].note
		});

	};
}