var express = require('express');
const mongoose = require("mongoose");
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
        mongoose.connect(mongoDB).then(() => {
            const db = mongoose.connection;
            db.on('error', console.error.bind(console, 'MongoDB connection error:'));
            console.log('db connection initiated');

            let name;
            let pw;
            let inputCredentials = req.headers.authorization;
            if (inputCredentials !== undefined) {

            } else {
                res.status(401).send("No user-credentials given");
                return;
            }

            db.collection("users").findOne({username: name, password: pw}, (err) => {
                if (err) {
                    res.status(401).send("Wrong user-credentials given");
                    return;
                } else {
                    next();
                }
            });
        }).catch(() => {
            console.log("503: Connection do db failed");
            res.status(503).send("Connection do db failed");
            return;
        });
    } else {
        next();
    }
})

module.exports = router;