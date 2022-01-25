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
                ut.sendIfNotAlready(res, 401, "No user-credentials given");
                return;
            }
            userSchema.find({email: email, password: pw}, (err, lst) => {
                if (err) {
                    console.log("503: Connection to db failed");
                    ut.sendIfNotAlready(res, 503, "Connection to db failed");
                } else {
                    if (lst.length !== 0) {
                        let tokenString = ut.createToken(email);
                        userSchema.findOneAndUpdate({
                            email: email,
                            password: pw
                        }, {currentToken: tokenString}, null, (err) => {
                            if (err) {
                                console.log("401: Wrong user-credentials given");
                                ut.sendIfNotAlready(res, 401, "Wrong user-credentials given");
                            } else {
                                ut.sendIfNotAlready(res, 200, tokenString);
                            }
                        })

                    } else {
                        console.log("401: Wrong user-credentials given");
                        ut.sendIfNotAlready(res, 401, "Wrong user-credentials given");
                    }
                }
            });
        } else {
            console.log("401: You are already logged in");
            ut.sendIfNotAlready(res, 401, "You are already logged in");
        }
    })
})

module.exports = router;
