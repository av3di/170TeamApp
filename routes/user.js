var users = require('../users.json');
var models = require('../models');

exports.saveuser = function(req, res) {
	var new_user = new models.User({'username': req.body.username, 'email': req.body.email, 'password': req.body.password, 'notes':[]});
	if(req.body.password2 != req.body.password)
	{
		res.render('signup', {'error': true});
	}
	else // passwords match
	{
		models.User.find({"email":req.body.email}).exec(afterQuery);
		function afterQuery(err, q_user){
			if(err) {console.log(err);}
			if(q_user.length != 0) { // user with same email was found
				res.render('signup', {'error': true});
			}
			else  // unique email
			{
				req.session.username = req.body.username;
				req.session.email = req.body.email;
				req.session.notes = [];
				req.session.loggedin = true;
				new_user.save(aftersave);
				function aftersave(err) {
					if(err) {console.log(err);}
					console.log("Okay, new user saved.");
					res.render('user', {
						'username': req.session.username,
					'notes': req.session.notes
					});
				}
			} 
		}
	}
};

exports.viewuser = function(req, res) {
	if(req.session.email && req.session.loggedin)
	{
		res.render('user', {
			'username': req.session.username,
			'notes': req.session.notes
		});
	}
	else // user is not logged in
	{
		res.render('index', {'error':false})
	}
};

exports.finduser = function(req, res) {
	req.session.email = req.body.email;
	console.log("The email in session is " + req.session.email);
	var user_email = req.body.email;
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
				req.session.username = q_user[0].username;
				req.session.email = q_user[0].email;
				req.session.notes = q_user[0].notes;
				req.session.loggedin = true;
				res.render('user', {
					'username': req.session.username,
					'notes': req.session.notes
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
	if(req.session.email && req.session.loggedin)
	{
		console.log("The email in session is " + req.session.email);
		var newclass = {"class": req.body.class, "note":""};
		console.log("Added " + req.body.class + "to your class list.");
		var duplicate = false;
		var index = 0;
		while(index < req.session.notes.length)
		{
			if(req.session.notes[index].class == req.body.class)
				duplicate = true;
			index++;
		}
		if(!duplicate)
			req.session.notes = req.session.notes.concat(newclass);
		models.User.update({"email": req.session.email}, {'$push': {"notes": newclass}}).exec(afterUpdate);
		function afterUpdate(err) {
			if(err) {console.log(err);}
			console.log("Added " + req.body.class + "to your class list.");
			res.render('user', {
				'username': req.session.username,
				'notes': req.session.notes
			});
		}
	}
	else // user is not logged in
	{
		res.render('index', {'error':false})
	}
};

exports.deleteclass = function(req, res) {
	if(req.session.email && req.session.loggedin)
	{
		var index = 0;
		var newclasses = [];
		console.log("The email in session is " + req.session.email);
		while(index < req.session.notes.length)
		{
			if(req.body.class != req.session.notes[index].class)
			{
				newclasses.push(req.session.notes[index]);
			}
			index++;
		}
		req.session.notes = newclasses;
		models.User.update({"email": req.session.email}, {'$pull': {"notes": {"class": req.body.class}}}).exec(afterDelete);
		function afterDelete(err) {
			if(err) {console.log(err);}
			res.render('user', {
				'username': req.session.username,
				'notes': req.session.notes
			});
		}
	}
	else // user is not logged in
	{
		res.render('index', {'error':false, 'error_nl': true})
	}
};