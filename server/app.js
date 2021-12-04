var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var mongoose = require('mongoose');

import User from "/models/user.js";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/register', (req, res, next) => {
    const MongoDB = 'mongodb://localhost:27017/user';
    mongoose.connect(mongoDB);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    console.log('db connection initiated');

    const userToken = req.headers.authorization;
    User.find({password: userToken}, (err, l) => {
        if (err) {
            const today = new Date();
            const creationDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
                + '--' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

            const jwt = require('njwt');
            const claims = {username: username};
            const token = jwt.create(claims, 'top-sectret');
            token.setExpiration();
            const jwtTokenString = token.compact();

            const user = {      //TODO: check how credentials are send over with the request
                username:,
                fullName:,
                password: jwtTokenString,
                email:,
                dateOfCreation: creationDate,
                lastEdited: [],
                lastComments: []
            };
            const savedUser = new User(user);
            savedUser.save().then(doc => {      //TODO: check for any suitable error handling
            }).catch(err => {
            });
        } else {
            //TODO: Consider what to do, when the registration token is already in the db
        }
    })
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
