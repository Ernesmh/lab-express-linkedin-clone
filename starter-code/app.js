const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const dbURL = 'mongodb://localhost/linkedin';
const index = require('./routes/index');
const users = require('./routes/users');
const authController = require ('./routes/authController');
const privController = require ('./routes/privController')
mongoose.connect(dbURL).then( () => {
  debug(`Connected to ${dbURL}`);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(favicon(path.join(__dirname, 'public', 'img/favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60*60*24 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 * 2
  })
}));

app.use('/', index);
app.use('/users', users);
app.use('/', authController);
app.use('/', privController);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
