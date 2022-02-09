let express = require('express');
let path = require('path');
let cors = require('cors');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let loginRouter = require('./routes/login');
let registerRouter = require('./routes/register');
let eternalRouter = require('./routes/eternal');
let {imgRouter} = require('./routes/img');
let editorRouter = require('./routes/editor');
let singleRouter = require('./routes/single');
let profileRouter = require('./routes/profile');
let createRouter = require('./routes/create');
let retrieveRouter = require('./routes/retrieve');
let statisticRouter = require('./routes/statistics');
let verifyRouter = require('./routes/verify');

const mongoose = require("mongoose");
require('body-parser');
require('dotenv/config');
const {userAPI} = require("./utils");
let app = express();

const corsOptions = {origin: true, credentials: true}
app.options('*', cors(corsOptions));
app.listen(8000, function () {
    console.log('CORS-enabled web server listening on port 8000');
});

mongoose.connect(process.env.MONGO_URL,
    {useNewUrlParser: true, useUnifiedTopology: true}, err => {
        if (err) {
            console.log("503: Connection to db failed");
        }
        mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
        console.log('db connection initiated');
    });
userAPI();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: false}));
app.use(cookieParser());

//Image Storage

app.use('/create', createRouter); //API create
app.use('/retrieve', retrieveRouter); //API retrieve
app.use('/register', registerRouter); //register-activity
app.use('/login', loginRouter); //login activity
app.use('/verify', verifyRouter);
app.use(express.static(path.join(__dirname, 'public')));

//constant checking if someone is logged in
app.use(eternalRouter);
app.use('/editor', editorRouter); //Editor
app.use('/profile', profileRouter); //Profile overview
app.use('/images', imgRouter); //showing images
app.use('/image', singleRouter); // Single view of an Image
app.use('/statistics', statisticRouter); // Showing of graphs

app.use(indexRouter);


// catch 404 and forward to error handler
app.use(function (req, res) {
    console.log("somehow landed here");
    res.status(404).send("Page not found");
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
