var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var mongoose = require('mongoose');
var User = require('./models/user');
const jwt = require("njwt");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//register-activity
app.use('/register', (req, res, next) => {

    var connected;
    const mongoDB = 'mongodb://localhost:27017/user';
    var promise = new Promise(function (resolve, reject) {
        mongoose.connect(mongoDB);
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        console.log('db connection initiated');

        //TODO: Get credentials of user

        User.find({password: userToken}, (err, l) => {
            if (err) {
                const today = new Date();
                const creationDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
                    + '--' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

                const claims = {username: 'h.potter@hpwgwarts.de'};
                const token = jwt.create(claims, 'top-sectret');
                const jwtTokenString = token.compact();


                const user = {      //TODO: check how credentials are send over with the request
                    username: "harry69",
                    fullName: "harry potter",
                    password: jwtTokenString,
                    email: 'h.potter@howarts.de',
                    dateOfCreation: creationDate,
                    lastEdited: [],
                    lastComments: []
                };

                User.create(user).then(doc => {
                    connected = true;
                }).catch(err => {
                    connected = false; //TODO: check for any suitable error handling
                });
            } else {
                //TODO: Consider what to do, when the registration token is already in the db
            }
        })
    })
    promise.then(function (value) {
        if (connected) {
            next();
        } else {
            res.set('WWW-Authenticate', 'Basic realm="401"')
            res.status(401).send()
            return;
        }
    })
});


//login activity
app.use('/login', (req, res, next) => {
    const mongoDB = 'mongodb://localhost:27017/user';
    mongoose.connect(mongoDB);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    console.log('db connection initiated');

    var loginInput = req.headers.authorization
    var userToken;
    var givenEmail;
    console.log(loginInput)
    if (loginInput !== undefined) {
        loginInput = loginInput.split(' ')[1];
        loginInput = Buffer.from(loginInput, 'base64').toString('ascii');
        var listInput = loginInput.split(':');
        userToken = listInput[1];
        givenEmail = loginInput[0];
        console.log("in login")
    } else {
        console.log("missed login")
        return;
    }

    User.find({email: givenEmail, password: userToken}, (err, l) => {
        if (err) {
            res.set('WWW-Authenticate', 'Basic realm="401"')
            res.status(401).send()
            return;
        } else {
            next();
        }
    })
});

//constant checking if someone is logged in
app.use((req, res, next) => {
    const jwt = require('njwt')
    const { token } = req.query;
    jwt.verify(token, 'top-secret', (err, verifiedJwt) => {
        if (err) {
            res.status(401).send(err.message)
        } else {
            // if verification successful, continue with next middlewares
            console.log(verifiedJwt)
            next()
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
