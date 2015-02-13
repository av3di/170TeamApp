var users = require('../users.json');

exports.userInfo = function(req, res) {
	console.log("The username passed in is " + req.params.username);
	var user_name = req.params.username;
	var current_user = users[0];
	var index = 0;
	while(index < users.length)
	{
		if(users[index].username == user_name)
		  current_user = users[index]
		index++;
	}
  	res.json(current_user);
}