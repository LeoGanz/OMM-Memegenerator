const express = require('express');
const mongoose = require("mongoose");
const jwt = require("njwt");
const router = express.Router();
const mongoDB = 'mongodb://localhost:27017';
let utils = require("../utils");
let ut = new utils();

router.get('/', (req, res, next) => {
    if (!ut.checkForToken(req.query.token)) {
        mongoose.connect(mongoDB).then(() => {
            const db = mongoose.connection;
            db.on('error', console.error.bind(console, 'MongoDB connection error:'));
            console.log('db connection initiated');

            let name;
            let pw;
            let inputCredentials = req.headers.authorization;
            if (inputCredentials !== undefined) {
                let namePW = inputCredentials.split(" ");
                name = namePW[0];
                pw = namePW[1];
            } else {
                console.log("401: No user-credentials given");
                res.status(401).send("No user-credentials given");
                return;
            }

            db.collection("users").findOne({username: name, password: pw}, (err) => {
                if (err) {
                    console.log("401: Wrong user-credentials given");
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
