const express = require('express');
const mongoose = require("mongoose");
const jwt = require("njwt");
const router = express.Router();
const mongoDB = 'mongodb://localhost:27017';
let utils = require("../utils");

router.get('/', (req, res, next) => {
    const token = req.query.token;
    const credentials = req.headers.authorization;
    if (utils.checkForToken(token)) {
        next();
    } else if (credentials !== undefined) {
        mongoose.connect(mongoDB).then(() => {
            const db = mongoose.connection;
            db.on('error', console.error.bind(console, 'MongoDB connection error:'));
            console.log('db connection initiated');
            let namePW = credentials.split(" ");
            let name = namePW[0];
            let pw = namePW[1];
            db.collection("users").findOne({username: name, password: pw}, (err) => {
                if(err){
                    console.log("401: Wrong user-credentials given");
                    res.status(401).send("Wrong user-credentials given");
                    return;
                }else{
                    next();
                }
            });

        }).catch(() => {
            console.log("503: Connection do db failed");
            res.status(503).send("Connection do db failed");
            return;
        });
    } else {
        console.log("401: No authorization to do this");
        res.status(401).send("No authorization to do this");
        return;
    }
});

module.exports = router;