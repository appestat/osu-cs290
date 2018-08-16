var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon'); // added for login
var bodyParser = require('body-parser'); // added for login
var expressValidator = require('express-validator');

//Authentication packages
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
// all added for login


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// don't know if we need this later, but ready to uncomment:
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json()); // added for login
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressValidator()); // added for login
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// BEGIN added for login ********************
/*
var options = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database : process.env.DB_NAME
};
*/
/*
var options = {
  host: 'classmysql.engr.oregonstate.edu',
  user: 'cs290_gayk',
  password: 'cs290proj',
  database : 'cs290_gayk',
};
*/

 var options = require('./config/dbCredentials.json');


var sessionStore = new MySQLStore(options);
app.use(session({
  secret: 'hghjjkahueriu',
  resave: false,
  store:sessionStore,
  saveUninitialized: true,
  //cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
})

// END added for login ***********************

app.use('/', indexRouter);
app.use('/users', usersRouter); // example has users instead of usersRouter

// BEGIN added for login *********************

passport.use(new LocalStrategy(
  function(username, password, done) {
      console.log(username);
      console.log(password);

      var db = require('mysql2');
      const config = require('./config/dbCredentials.json');
      var conPool = db.createPool(config);
      // const db = require('./config/dbCredentials.json');

      conPool.query('SELECT user_id,password from users where username=?',[username],function(err,results,fields){
        console.log(results);
        if(err) done(err);

        if(results.length === 0 ) {
          return done(null,false) //Be careful and do not put false in quotes
        }
        else {
          const hash = results[0].password.toString();
          bcrypt.compare(password,hash,function(err,res){
            if (res == true) {
              return done(null,{user_id:results[0].id});
            }
            else done(null,false);
          });
        }
      })
  }
));

// END added for login ***********************

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found'); // added for login, why not?
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
