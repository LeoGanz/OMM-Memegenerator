const express = require('express');
const jwt = require("njwt");
const router = express.Router();
const userSchema = require("../models/userSchema");

router.use((req, res, next) => {
    const token = req.query.token;
    if (token instanceof String) {
        const credentials = req.headers.authorization;
        jwt.verify(token, "top-secret", (err) => {
            if (!err) {
                next();
            } else if (credentials !== undefined) {
                let namePW = credentials.split(" ");
                let name = namePW[0];
                let pw = namePW[1];
                userSchema.find({username: name, password: pw}, (err) => {
                    if (err) {
                        console.log("401: Wrong user-credentials given");
                        res.status(401).send("Wrong user-credentials given");
                    } else {
                        console.log("You are logged in");
                        next();
                    }
                });
            } else {
                console.log("401: No authorization to do this");
                res.status(401).send("No authorization to do this");
            }
        })
    } else {
        console.log("400: You need to give a string as a token");
        res.status(400).send("You need to give a string as a token");
    }
});

module.exports = router;