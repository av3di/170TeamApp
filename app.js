
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')
var mongoose = require('mongoose');

var index = require('./routes/index');
var my_notes = require('./routes/my_notes');
var user = require('./routes/user');
var logout = require('./routes/logout');

// Example route
// var user = require('./routes/user');

// Connect to the Mongo database, whether locally or on Heroku
// MAKE SURE TO CHANGE THE NAME FROM 'lab7' TO ... IN OTHER PROJECTS
var local_database_name = 'notasdb';
var local_database_uri  = 'mongodb://localhost/' + local_database_name
var database_uri = process.env.MONGOLAB_URI || local_database_uri
mongoose.connect(database_uri);

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


// Add routes here
app.get('/', index.view);
app.post('/', user.saveuser);

//app.get('/project/:id', project.projectInfo);
app.get('/user', user.viewuser);
app.post('/user', user.finduser);
app.get('/my_notes', my_notes.viewnotes);
app.post('/addnote', my_notes.addnote);
app.post('/pullnote', my_notes.pullnote);
app.post('/updatenote', my_notes.updatenote);
app.post('/addclass', user.addclass);
app.post('/deleteclass', user.deleteclass);
app.post('/addclassn', user.addclassn);
app.post('/deleteclassn', user.deleteclassn);
app.get('/forgot', function(req, res) {
	res.render('forgot', {})
});
app.get('/tutorial', function(req, res) {
	res.render('tutorial', {})
});
app.get('/signup', function(req, res) {
	res.render('signup', {})
});
app.get('/logout', logout.view);
// Example route
// app.get('/userslucy', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});