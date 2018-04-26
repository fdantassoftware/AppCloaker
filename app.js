var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
//user auth
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');

var cards = require('./routes/casinos')


var fs = require('fs');

var app = express();


app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } }; 


app.listen(process.env.PORT || 6300, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// var passport = require('./config/passport');// pass passport for configuration

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);


// Post api with Body param from client

app.post('/getAllLists', cards.getAllLists);

app.post('/getAllItems', cards.getAllItems);



app.get('/cards', cards.findAll);
app.get('/cItems', cards.findAllCItems);
app.get('/lists', cards.findAllList);
app.get('/layouts', cards.findAllLayout);// load layout of home container

app.get('/cards/:id', cards.findOne);
app.get('/cItems/:id', cards.findOneCItem);
app.get('/lists/:id', cards.findOneList);
app.get('/addToList/:id', cards.findOneList);
app.get('/layouts/:id', cards.findOneLayout);

// Get for update app
app.get('/app/:id', cards.findOneApp);
app.post('/updateapp', cards.updateApp);


// For the false path
app.post('/falselist', cards.AddFalseList);
app.get('/falselists', cards.findAllLFalseLists);
app.delete('/falselist/:id', cards.deleteFalseList);
app.get('/falselists/:id', cards.findOneFalseList);

app.put('/falselists/:id', cards.updateFalseList);

app.post('/updateFalseListId', cards.updateFalseListId);


// For the Apps
app.post('/addapp', cards.AddApp);
app.get('/showapps', cards.findAllApps);


// For ISPs

// app.get('/showisps', cards.findAllIsps);
app.post('/showisps', cards.findAllIsps);
app.post('/addisps', cards.addIsps);

// For Countries

app.post('/showcountries', cards.findAllCountries);
app.post('/addcountries', cards.addCountries);





app.post('/cards', cards.addCard);
app.post('/cItem', cards.addCItem);
app.post('/lists', cards.addList);
app.post('/layouts', cards.addLayout);

app.post('/updateListId', cards.updateListId);




app.put('/cards/:id', cards.updateCard);
app.put('/lists/:id', cards.updateList);
app.put('/cItems/:id', cards.updateCItem);
app.put('/layouts/:id', cards.updateLayout); //update layout of home container

app.delete('/cards/:id', cards.deleteCard);
app.delete('/lists/:id', cards.deleteList);
app.delete('/cItems/:id', cards.deleteCItem);
app.delete('/layouts/:id', cards.deleteLayout);// delete layout of home containe

// Delete App

app.delete('/app/:id', cards.deleteApp);


app.post('/getAllListsByCountry', cards.getAllListsByCountry);


// Post for Rules

app.post('/addrule', cards.addRule);

app.post('/showrules', cards.getAllRules);

app.post('/updatecard', cards.updateCard);
app.post('/getcard', cards.getCard);


app.get('*', cards.home);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found') ;
  err.status = 404;
  next(err);
})
;
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
