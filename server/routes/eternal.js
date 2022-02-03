const express = require('express');
const router = express.Router();
const userSchema = require("../models/userSchema");
const {jwtVerify, respond} = require("../utils");

/**
 * This route checks if a user is logged in.
 */

router.use((req, res, next) => {
    // console.log(typeof token === "string");
    jwtVerify(req, _ => {
        next();
    }, _ => {
        const credentials = req.headers.authorization;
        if (credentials !== undefined) {
            let namePW = credentials.split(" ");
            let name = namePW[0];
            let pw = namePW[1];
            userSchema.find({username: name, password: pw}, (err, lst) => {
                if (err) {
                    respond(res, 401, "Wrong user-credentials given");
                } else {
                    if (lst.length === 0) {
                        respond(res, 401, "No authorization to do this");
                    } else {
                        next();
                    }
                }
            });
        } else {
            respond(res, 401, "No authorization to do this");
        }
    });
});

module.exports = router;