var user = require('./user.js');

exports.view = function(req, res) {
	user.current_user = null;
	res.render('logout', {});
}