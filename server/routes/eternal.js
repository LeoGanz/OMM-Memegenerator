const express = require('express');
const jwt = require("njwt");
const router = express.Router();
const userSchema = require("../models/userSchema");
const utils = require('../utils');
const ut = new utils();

router.use((req, res, next) => {
    const token = ut.adjustToken(req);
    // console.log(typeof token === "string");
    if (typeof token === "string") {
        const credentials = req.headers.authorization;

        jwt.verify(token, "top-secret", (err) => {
            if (!err) {
                next();
            } else if (credentials !== undefined) {
                let namePW = credentials.split(" ");
                let name = namePW[0];
                let pw = namePW[1];
                userSchema.find({username: name, password: pw}, (err, lst) => {
                    if (err) {
                        ut.respond(res,401,"Wrong user-credentials given");
                    } else {
                        if (lst.length === 0) {
                            ut.respond(res,401,"No authorization to do this");
                        } else {
                            next();
                        }
                    }
                });
            } else {
                ut.respond(res, 401, "No authorization to do this");
            }
        })
    } else {
        ut.respond(res, 400, "You need to give a string as a token");
    }
});

module.exports = router;