var express = require('express');
const mongoose = require("mongoose");
const User = require("../models/user");
const jwt = require("njwt");
var router = express.Router();
const mongoDB = 'mongodb://localhost:27017/user';

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

router.get('/', (req, res, next) => {
    if (!checkForToken(req.query.token)) {
        mongoose.connect(mongoDB)
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        console.log('db connection initiated');

        let name;
        let pw;
        let inputCredentials = req.headers.authorization;
        if (inputCredentials !== undefined) {
            inputCredentials = inputCredentials.split(" ")[1];
            let namePw = inputCredentials.split(":");
            name = namePw[0];
            pw = namePw[1];
        } else {
            res.set('WWW-Authenticate', 'Basic realm="401"')
            res.status(401).send()
            return;
        }

        db.collection("users").findOne({email: name, password: pw}, (err, l) => {
            if (err) {
                res.set('WWW-Authenticate', 'Basic realm="401"')
                res.status(401).send()
                return;
            } else {
                const claims = {permission: 'read-data', username: 'student'};
                const token = jwt.create(claims, 'something-top-secret');
                const jwtTokenSting = token.compact();
                db.collection("users").findOneAndUpdate({
                    email: name,
                    password: pw
                }, {$set: {currentToken: jwtTokenSting}}).then(() => next());
            }
        });
    } else {
        next();
    }
})

module.exports = router;