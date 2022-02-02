const express = require('express');
const router = express.Router();
const userSchema = require("../models/userSchema");
const utils = require('../utils');
const ut = new utils();

/**
 * This route checks if a user is logged in.
 */

router.use((req, res, next) => {
    // console.log(typeof token === "string");
    ut.jwtVerify(req, _ => {
        next();
    }, _ => {
        const credentials = req.headers.authorization;
        if (credentials !== undefined) {
            let namePW = credentials.split(" ");
            let name = namePW[0];
            let pw = namePW[1];
            userSchema.find({username: name, password: pw}, (err, lst) => {
                if (err) {
                    ut.respond(res, 401, "Wrong user-credentials given");
                } else {
                    if (lst.length === 0) {
                        ut.respond(res, 401, "No authorization to do this");
                    } else {
                        next();
                    }
                }
            });
        } else {
            ut.respond(res, 401, "No authorization to do this");
        }
    });
});

module.exports = router;