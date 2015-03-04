/*
 * GET home page.
 */

exports.view = function(req, res){
	var random_num = Math.random();
	if(random_num > 0.5) {
	res.render("index", {'error': false});
	}
	else {
	res.render("index2", {'error': false});
	}
};
