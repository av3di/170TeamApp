var users = require('../users.json');

exports.userInfo = function(req, res) {
	console.log("The email passed in is " + req.body.email);
	var user_email = req.body.email;
	var current_user = users[0];
	var index = 0;
	while(index < users.length)
	{
		if(users[index].email == user_email)
		  current_user = users[index]
		index++;
	}
  	res.render('user', {
		'username': current_user.username,
		'notes': current_user.notes
	});
};