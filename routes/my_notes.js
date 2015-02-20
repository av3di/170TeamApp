var users = require('../users.json');

exports.mynotes = function(req, res) {
	var user_email = req.body.email;
	var current_user = users[0];
	var index = 0;
	while(index < users.length)
	{
		if(users[index].email == user_email)
		  current_user = users[index]
		index++;
	}
  	res.render('my_notes', {
		'notes': current_user.notes
	});
};