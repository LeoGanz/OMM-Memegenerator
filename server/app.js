let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let loginRouter = require('./routes/login');
let registerRouter = require('./routes/register');
let eternalRouter = require('./routes/eternal');
let imgRouter = require('./routes/img');
let editorRouter = require("./routes/editor");
const mongoose = require("mongoose");
require('body-parser');
require('dotenv/config');
let app = express();

mongoose.connect(process.env.MONGO_URL,
    {useNewUrlParser: true, useUnifiedTopology: true}, err => {
        if (err) {
            console.log("503: Connection to db failed");
        }
        mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
        console.log('db connection initiated');
    });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

//Image Storage


app.use('/users', usersRouter); //displaying all users
app.use('/register', registerRouter); //register-activity
app.use('/login', loginRouter); //login activity
app.use(express.static(path.join(__dirname, 'public')));

//constant checking if someone is logged in
app.use(eternalRouter);
app.use('/editor', editorRouter);
app.use('/images', imgRouter); //showing images

app.use(indexRouter);







// catch 404 and forward to error handler
app.use(function (req, res, next) {
    console.log("somehow landed here");
    next(createError(404));
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
