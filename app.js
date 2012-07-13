/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

if (!process.env['SAPI_KEY']) {
  throw "Environment variable SAPI_KEY must be defined";
}

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/splash', routes.splash);
app.get('/outside', routes.outside);
app.get('/highscores', routes.highscores);
app.get('/user/:id', routes.user);

app.get('/list', routes.list);
app.get('/form', routes.form);

app.post('/business', routes.addBusiness);

process.on('uncaughtException', function (err) {
  console.error('Uncaught exception: ' + err.message);
});

app.listen('production' === process.env.NODE_ENV ? 80 : 3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
