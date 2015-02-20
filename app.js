
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')

var index = require('./routes/index');
var project = require('./routes/project');
var palette = require('./routes/palette');
var user = require('./routes/user');

var users = require('./users.json');
var easyjson = require('easyjson').path('users');
// Example route
// var user = require('./routes/user');

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var current_user;
var current_class_i = 0;
// Add routes here
app.get('/', index.view);
app.post('/', function(req, res) {
	var new_user = {'username': req.body.username, 'email': req.body.email, 'password': req.body.password, 'notes':[{'class':'', 'note':''}]};
	current_user = new_user;
	users[users.length] = new_user;
	res.render('index', {});
});

app.get('/project/:id', project.projectInfo);
app.get('/palette', palette.randomPalette);
app.get('/user', function(req, res) {
	res.render('user', {
		'username': current_user.username,
		'notes': current_user.notes
	});
});
app.post('/user', function(req, res) {
	var user_email = req.body.email;
	current_user = users[0];
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
});
app.get('/my_notes', function(req, res) {
  	res.render('my_notes', {
		'notes': current_user.notes
	});
});
app.post('/addnote', function(req, res) {
	var index = 0;
	while(index < current_user.notes.length)
	{
		if(req.body.class == current_user.notes[index].class)
		{
			if(current_user.notes[index].note) // check if string is not null
				current_user.notes[index].note = current_user.notes[index].note + " " + req.body.text;
			else // there are no notes for this class yet.
				current_user.notes[index].note = req.body.text;
			break;
		}
		index++;
	}
	res.render('my_notes', {
			'username': current_user.username,
			'notes': current_user.notes
	});
});
app.post('/pullnote', function(req, res) {
    current_class_i = 0;
	while(current_class_i < current_user.notes.length)
	{
		if(req.body.class == current_user.notes[current_class_i].class)
		{
			break;
		}
		current_class_i++;
	}
	res.render('my_notes', {
			'username': current_user.username,
			'notes': current_user.notes,
			'update_note': current_user.notes[current_class_i].note
	});
});
app.post('/updatenote', function(req, res) {
	current_user.notes[current_class_i].note = req.body.text;
	res.render('my_notes', {
			'username': current_user.username,
			'notes': current_user.notes,
			'update_note': current_user.notes[current_class_i].note
	});
});
app.post('/addclass', function(req, res) {
	var newclass = {};
	newclass['class'] =  req.body.class;
	current_user.notes = current_user.notes.concat(newclass);
	res.render('user', {
			'username': current_user.username,
			'notes': current_user.notes
	});
});
app.post('/deleteclass', function(req, res) {
	var index = 0;
	var newclasses = [];
	while(index < current_user.notes.length)
	{
		if(req.body.class != current_user.notes[index].class)
		{
			newclasses.push(current_user.notes[index]);
		}
		index++;
	}
	current_user.notes = newclasses;
	res.render('user', {
			'username': current_user.username,
			'notes': current_user.notes
	});
});
app.post('/addclassm', function(req, res) {
	var newclass = {};
	newclass['class'] =  req.body.class;
	current_user.notes = current_user.notes.concat(newclass);
	res.render('my_notes', {
			'username': current_user.username,
			'notes': current_user.notes
	});
});
app.post('/deleteclassm', function(req, res) {
	var index = 0;
	var newclasses = [];
	while(index < current_user.notes.length)
	{
		if(req.body.class != current_user.notes[index].class)
		{
			newclasses.push(current_user.notes[index]);
		}
		index++;
	}
	current_user.notes = newclasses;
	res.render('my_notes', {
			'username': current_user.username,
			'notes': current_user.notes
	});
});
app.get('/forgot', function(req, res) {
	res.render('forgot', {})
});
app.get('/tutorial', function(req, res) {
	res.render('tutorial', {})
});
app.get('/signup', function(req, res) {
	res.render('signup', {})
});
// Example route
// app.get('/userslucy', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});