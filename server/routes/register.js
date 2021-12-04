var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
import User from '../models/user.js'

router.get('/register', (req, res, next) => {

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

                const jwt = require('njwt');
                const claims = {username: username};
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


module.exports = router;