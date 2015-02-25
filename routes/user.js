var users = require('../users.json');
var models = require('../models');

exports.current_user = {};
exports.current_class_i = 0;

exports.saveuser = function(req, res) {
	var new_user = new models.User({'username': req.body.username, 'email': req.body.email, 'password': req.body.password, 'notes':[]});
	exports.current_user = new_user;
	new_user.save(aftersave);
	function aftersave(err) {
		if(err) {console.log(err);}
		console.log("Okay, new user saved.");
		res.render('index', {'error': false});
	}
};

exports.viewuser = function(req, res) {
	res.render('user', {
		'username': exports.current_user.username,
		'notes': exports.current_user.notes
	});
};

exports.finduser = function(req, res) {
	var user_email = req.body.email;
	exports.current_user = users[0];
	var index = 0;
	models.User.find({"email":user_email}).exec(afterQuery);
	function afterQuery(err, q_user){
		if(err) {console.log(err);}
		if(!q_user[0]) { // no user was found
			res.render('index', {'error': true});
		}
		else 
		{
			if(req.body.password == q_user[0].password) {
				exports.current_user = q_user[0];
				res.render('user', {
					'username': q_user[0].username,
					'notes': q_user[0].notes
				});
			}
			else 
			{
				res.render('index', {'error': true});
			}
		} 
	};
};

exports.addclass = function(req, res) {
	var newclass = {"class": req.body.class, "note":""};
	console.log("Added " + req.body.class + "to your class list.");
		var duplicate = false;
	var index = 0;
	while(index < exports.current_user.notes.length)
	{
		if(exports.current_user.notes[index].class == req.body.class)
			duplicate = true;
		index++;
	}
	if(!duplicate)
		exports.current_user.notes = exports.current_user.notes.concat(newclass);
	models.User.update({"username": exports.current_user.username}, {'$push': {"notes": newclass}}).exec(afterUpdate);
	function afterUpdate(err) {
		if(err) {console.log(err);}
		console.log("Added " + req.body.class + "to your class list.");
		res.render('user', {
			'username': exports.current_user.username,
			'notes': exports.current_user.notes
		});
	}
};

exports.deleteclass = function(req, res) {
	var index = 0;
	var newclasses = [];
	while(index < exports.current_user.notes.length)
	{
		if(req.body.class != exports.current_user.notes[index].class)
		{
			newclasses.push(exports.current_user.notes[index]);
		}
		index++;
	}
	exports.current_user.notes = newclasses;
	models.User.update({"username": exports.current_user.username}, {'$pull': {"notes": {"class": req.body.class}}}).exec(afterDelete);
	function afterDelete(err) {
		if(err) {console.log(err);}
		res.render('user', {
			'username': exports.current_user.username,
			'notes': exports.current_user.notes
		});
	}
};
exports.addclassn = function(req, res) {
	var newclass = {};
	newclass['class'] =  req.body.class;
	newclass['note'] = "";
	var duplicate = false;
	var index = 0;
	while(index < exports.current_user.notes.length)
	{
		if(exports.current_user.notes[index].class == req.body.class)
			duplicate = true;
		index++;
	}
	if(!duplicate)
		exports.current_user.notes = exports.current_user.notes.concat(newclass);
	models.User.update({"_id":exports.current_user._id}, {'$push': {"notes": newclass}}).exec(afterUpdate);
	function afterUpdate(err) {
		if(err) {console.log(err);}
		console.log("Added " + req.body.class + "to your class list.");
		res.render('my_notes', {
			'username': exports.current_user.username,
			'notes': exports.current_user.notes
		});
	}
};
exports.deleteclassn = function(req, res) {
	var index = 0;
	var newclasses = [];
	while(index < exports.current_user.notes.length)
	{
		if(req.body.class != exports.current_user.notes[index].class)
		{
			newclasses.push(exports.current_user.notes[index]);
		}
		index++;
	}
	exports.current_user.notes = newclasses;
	models.User.update({"_id":exports.current_user._id}, {'$pull': {"notes": {"class": req.body.class}}}).exec(afterUpdate);
	function afterUpdate(err) {
		if(err) {console.log(err);}
		res.render('my_notes', {
			'username': exports.current_user.username,
			'notes': exports.current_user.notes
		});
	}
};