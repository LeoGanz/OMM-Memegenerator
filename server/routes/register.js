var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.get('/register', (req, res, next) => {
    var promise = new Promise(function (resolve, reject) {

        const mongoDB = 'mongodb://localhost:27017/user';
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
                savedUser.save().then(doc => {
                    next();
                }).catch(err => { //TODO: check for any suitable error handling
                });
            } else {
                //TODO: Consider what to do, when the registration token is already in the db
            }
        })
    })
});



module.exports = router;