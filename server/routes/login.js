const express = require('express');
const router = express.Router();
const userSchema = require("../models/userSchema");
const {jwtVerify, respond, dbConnectionFailureHandler, createToken, respondSilently} = require("../utils");

/**
 * This method logs a user in. For more information look into LoginTestUser.txt or the REadme.
 */

router.get('/', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    jwtVerify(req, _ => {
        respond(res, 401, "You are already logged in");
    }, _ => {
        // alternative auth using username and password instead of token
        let email;
        let pw;
        let inputCredentials = req.headers.authorization;
        if (inputCredentials !== undefined) {
            let namePW = inputCredentials.split(" ");
            email = namePW[0];
            pw = namePW[1];
        } else {
            respond(res, 401, "No user-credentials given");
            return;
        }
        userSchema.find({email: email, password: pw}, (err, lst) => {
            if (err) {
                dbConnectionFailureHandler(res, err)
            } else {
                if (lst.length !== 0) {
                    let tokenString = createToken(email);
                    userSchema.findOneAndUpdate({
                        email: email,
                        password: pw
                    }, {currentToken: tokenString}, null, (err) => {
                        if (err) {
                            respond(res, 401, "Wrong user-credentials given");
                        } else {
                            respondSilently(res, 200, tokenString);
                        }
                    })

                } else {
                    respond(res, 401, "Wrong user-credentials given");
                }
            }
        });
    });
});

module.exports = router;
