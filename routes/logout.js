var user = require('./user.js');

exports.view = function(req, res) {
	req.session.destroy(function(err){
		if(err){
			console.log(err);
		}
		else
		{
			req.session = null;
			delete req.session;
			res.redirect('/');
		}
	});
}