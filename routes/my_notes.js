var models = require('../models');

exports.viewnotes = function(req, res) {
	if(req.session.email && req.session.loggedin)
	{
		console.log("The email in session is " + req.session.email);
		res.render('my_notes', {
			'notes': req.session.notes
		});
	}
	else // user is not logged in
	{
		res.render('index', {'error':false})
	}
};

exports.pullnote = function(req, res) {
	if(req.session.email && req.session.loggedin)
	{
		console.log("The email in session is " + req.session.email);
		var current_class_i = 0;
		console.log("Looking for notes for " + req.params.class);
		while(current_class_i < req.session.notes.length)
		{
			if(req.params.class == req.session.notes[current_class_i].class)
			{
				break;
			}
			current_class_i++;
		}
		console.log("Found class at " + current_class_i);
		console.log("Out of " + req.session.notes.length);
		res.render("edit_note", {
				'username': req.session.username,
				'class': req.params.class,
				'notes': req.session.notes,
				'update_note': req.session.notes[current_class_i].note,
				'current_class_i': current_class_i
		});
	}
	else // user is not logged in
	{
		res.render('index', {'error':false})
	}
};

exports.updatenote = function(req, res) {
	if(req.session.email && req.session.loggedin)
	{
		console.log("The email in session is " + req.session.email);
		
		req.session.notes[req.body.current_class_i].note = req.body.text;
		var mykey = "notes." + req.body.current_class_i + ".note";
		var myvalue = req.session.notes[req.body.current_class_i].note;
		var update = {$set: {}};
		update.$set[mykey] = myvalue;
		models.User.update({"email": req.session.email}, update).exec(afterAdd);
		function afterAdd(err) {
			if(err) { console.log(err); }
			console.log("Added a note.");
			res.render("my_notes", {
			'username': req.session.username,
			'notes': req.session.notes
			});

		};
	}
	else // user is not logged in
	{
		res.render('index', {'error':false})
	}
};

exports.viewall = function(req, res) {
	if(req.session.email && req.session.loggedin)
	{
		console.log("The email in session is " + req.session.email);
		console.log("Looking for notes for " + req.params.classname + "...");
		var new_notes = {};
		models.User.find({"notes.class": req.params.classname}).exec(afterfind);
		function afterfind(err, q_user) {
			if(err) { console.log(err); }
			console.log("Gathering all notes.");
			var new_i = 0;
			var i = 0;
			while(i < q_user.length)
			{
				var j = 0; 
				while(j < q_user[i].notes.length)
				{
					if(q_user[i].notes[j].class == req.params.classname)
					{
						new_notes[new_i] = {"class": req.params.classname, "note": q_user[i].notes[j].note};
						new_i++;
						break;
					}
					j++;
				}
				i++;
			}
			res.render("class", {
			'username': req.session.username,
			'notes': new_notes,
			'classname': req.params.classname
			});
		};
	}
	else // user is not logged in
	{
		res.render('index', {'error':false})
	}
}



