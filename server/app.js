var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');

var app = express();
var mongoose = require('mongoose');
var User = require('./models/user');
const jwt = require("njwt");
const mongoDB = 'mongodb://localhost:27017/user';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function checkForToken(token) {
    let isThere = false;
    jwt.verify(token, "top-secret", (err, verifiedJwt) => {
        console.log(verifiedJwt);
        console.log(token);
        if (err) {
            console.log(err);
        } else {
            isThere = true;
            console.log(verifiedJwt);
        }
    })
    return isThere;
}



app.use('/register', registerRouter); //register-activity
app.use('/login', loginRouter); //login activity

//constant checking if someone is logged in
app.use((req, res, next) => {
    const {token} = req.query;
    let err = checkForToken(token);
    if (!err) {
        res.status(401).send(err.message);
    } else {
        // if verification successful, continue with next middlewares
        next();
    }
});


app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
