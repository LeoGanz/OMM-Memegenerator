const express = require('express');
const router = express.Router();
const userSchema = require("../models/userSchema");
const utils = require("../utils");
const ut = new utils();
const jwt = require("njwt");

router.get('/', (req, res) => {
    let token = ut.adjustToken(req);
    jwt.verify(token, "top-secret", (err) => {
        if (err) {

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
            userSchema.find({email: email, password: pw}, (err, lst) => {
                if (err) {
                    console.log("503: Connection to db failed");
                    res.status(503).send("Connection to db failed");
                } else {
                    if (lst.length !== 0) {
                        let tokenString = ut.createToken(email);
                        userSchema.findOneAndUpdate({
                            email: email,
                            password: pw
                        }, {currentToken: tokenString}, (err) => {
                            if (err) {
                                console.log("401: Wrong user-credentials given");
                                res.status(401).send("Wrong user-credentials given");
                            } else {
                                res.status(200).send(tokenString);
                            }
                        })

                    } else {
                        console.log("401: Wrong user-credentials given");
                        res.status(401).send("Wrong user-credentials given");
                    }
                }
            });
        } else {
            console.log("401: You are already logged in");
            res.status(401).send("You are already logged in");
        }
    })
})

module.exports = router;
