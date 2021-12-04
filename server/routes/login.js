var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const User = require("../models/user.js");




router.get('/login', (req, res, next) => {
    const mongoDB = 'mongodb://localhost:27017/user';
    mongoose.connect(mongoDB);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    console.log('db connection initiated');

    var loginInput = req.headers.authorization
    var userToken;
    var givenEmail;
    if (loginInput !== undefined) {
        loginInput = loginInput.split(' ')[1];
        loginInput = Buffer.from(loginInput, 'base64').toString('ascii');
        var listInput = loginInput.split(':');
        userToken = listInput[1];
        givenEmail = loginInput[0];
    } else {
        return;
    }

    User.find({email: givenEmail, password: userToken}, (err, l) => {
        if (err) {
            res.set('WWW-Authenticate', 'Basic realm="401"')
            res.status(401).send()
            return
        } else {
            next();
        }
    })
});

module.exports = router;