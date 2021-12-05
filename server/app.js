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


//register-activity
app.use('/register', (req, res, next) => {
    if (!checkForToken(req.query.token)) {

        mongoose.connect(mongoDB).then(function (resolve, reject) {
            const db = mongoose.connection;
            db.on('error', console.error.bind(console, 'MongoDB connection error:'));
            console.log('db connection initiated');

            /**TODO: Get credentials of user and insert in {}*/
            let name;
            let pw;
            User.find({}, (err, l) => {
                if (err) {
                    const today = new Date();
                    const creationDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
                        + '--' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

                    let inputCredentials = req.headers.authorization;
                    if (inputCredentials !== undefined) {
                        inputCredentials = inputCredentials.split(" ")[1];
                        let namePw = inputCredentials.split(":");
                        name = namePw[0];
                        pw = namePw[1];
                    } else {
                        return;
                    }

                    const claims = {username: name};
                    const token = jwt.create(claims, 'top-secret');
                    const jwtTokenString = token.compact();

                    const user = {
                        /**TODO: check how credentials are send over with the
                         request and substitute the ones here*/
                        username: "harry69",
                        fullName: "harry potter",
                        password: pw,
                        currentToken: jwtTokenString,
                        email: name,
                        dateOfCreation: creationDate,
                        lastEdited: [],
                        lastComments: []
                    };

                    User.create(user).then(doc => {
                        next();
                    }).catch(err => {
                        //TODO: check for any suitable error handling
                    });
                } else {
                    //TODO: Consider what to do, when the registration credentials are already in the db
                }
            })
        });
    } else {
        next();
    }
});


//login activity
app.use('/login', (req, res, next) => {


    if (!checkForToken(req.query.token)) {
        mongoose.connect(mongoDB).then(function (resolve, reject) {
            const db = mongoose.connection;
            db.on('error', console.error.bind(console, 'MongoDB connection error:'));
            console.log('db connection initiated');

            //TODO: Get credentials of user and insert in {}
            let name;
            let pw;
            let inputCredentials = req.headers.authorization;
            if (inputCredentials !== undefined) {
                inputCredentials = inputCredentials.split(" ")[1];
                let namePw = inputCredentials.split(":");
                name = namePw[0];
                pw = namePw[1];
            } else {
                return;
            }

            User.find({email: name, password: pw}, (err, l) => {
                if (err) {
                    res.set('WWW-Authenticate', 'Basic realm="401"')
                    res.status(401).send()
                    return;
                } else {
                    const claims = {permission: 'read-data', username: 'student'};
                    const token = jwt.create(claims, 'something-top-secret');
                    const jwtTokenSting = token.compact();
                    User.findOneAndUpdate({
                        email: name,
                        password: pw
                    }, {currentToken: jwtTokenSting}, {new: true});
                    next();
                }
            })
        });
    } else {
        next();
    }
});

//constant checking if someone is logged in
app.use((req, res, next) => {
    const {token} = req.query;
    let err = checkForToken(token);
    if (!err) {
        res.status(401).send(err.message)
    } else {
        // if verification successful, continue with next middlewares
        next()
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
