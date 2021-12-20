const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const mongoDB = 'mongodb://localhost:27017/users';
let utils = require("../utils");
const userSchema = require("../models/userSchema");
let ut = new utils();

router.get('/', (req, res, next) => {
    if (!ut.checkForToken(req.query.token)) {
        mongoose.connect(mongoDB).then(() => {
            const db = mongoose.connection;
            db.on('error', console.error.bind(console, 'MongoDB connection error:'));
            console.log('db connection initiated');

            let email;
            let pw;
            let inputCredentials = req.headers.authorization;
            if (inputCredentials !== undefined) {
                let namePW = inputCredentials.split(" ");
                email = namePW[0];
                pw = namePW[1];
            } else {
                console.log("401: No user-credentials given");
                res.status(401).send("No user-credentials given");
                return;
            }

            userSchema.find({email: email, password: pw}, (err) => {
                if (err) {
                    console.log("401: Wrong user-credentials given");
                    res.status(401).send("Wrong user-credentials given");
                    return;
                } else {
                    next();
                }
            });
        }).catch(() => {
            console.log("503: Connection to db failed");
            res.status(503).send("Connection to db failed");
            return;
        });
    } else {
        next();
    }
})

module.exports = router;
