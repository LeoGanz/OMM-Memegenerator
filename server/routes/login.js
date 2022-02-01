const express = require('express');
const router = express.Router();
const userSchema = require("../models/userSchema");
const utils = require("../utils");
const ut = new utils();
const jwt = require("njwt");

router.get('/', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
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
                ut.respond(res, 401, "No user-credentials given");
                return;
            }
            userSchema.find({email: email, password: pw}, (err, lst) => {
                if (err) {
                    ut.dbConnectionFailureHandler(res, err)
                } else {
                    if (lst.length !== 0) {
                        let tokenString = ut.createToken(email);
                        userSchema.findOneAndUpdate({
                            email: email,
                            password: pw
                        }, {currentToken: tokenString}, null, (err) => {
                            if (err) {
                                ut.respond(res, 401, "Wrong user-credentials given");
                            } else {
                                ut.respondSilently(res, 200, tokenString);
                            }
                        })

                    } else {
                        ut.respond(res, 401, "Wrong user-credentials given");
                    }
                }
            });
        } else {
            ut.respond(res, 401, "You are already logged in");
        }
    })
})

module.exports = router;
