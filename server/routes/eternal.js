const express = require('express');
const mongoose = require("mongoose");
const jwt = require("njwt");
const router = express.Router();
const mongoDB = 'mongodb://localhost:27017';
const userSchema = require("../models/userSchema");

router.get('/', (req, res, next) => {
    const token = req.query.token;
    const credentials = req.headers.authorization;
    jwt.verify(token, "top-secret", (err) => {
        if (!err) {
            next();
        } else if (credentials !== undefined) {
            mongoose.connect(mongoDB).then(() => {
                mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
                console.log('db connection initiated');
                let namePW = credentials.split(" ");
                let name = namePW[0];
                let pw = namePW[1];
                userSchema.find({username: name, password: pw}, (err) => {
                    if (err) {
                        console.log("401: Wrong user-credentials given");
                        res.status(401).send("Wrong user-credentials given");
                    } else {
                        next();
                    }
                });
            }).catch(() => {
                console.log("503: Connection to db failed");
                res.status(503).send("Connection to db failed");
            });
        } else {
            console.log("401: No authorization to do this");
            res.status(401).send("No authorization to do this");
        }
    })
});

module.exports = router;