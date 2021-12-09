const express = require('express');
const mongoose = require("mongoose");
const jwt = require("njwt");
const router = express.Router();
const mongoDB = 'mongodb://localhost:27017/user';

function checkForToken(token) {
    let isThere = false;
    jwt.verify(token, "top-secret", (err, verifiedJwt) => {
        console.log(verifiedJwt);
        console.log(token);
        if (err) {
            console.log(err);
        } else {
            isThere = true;
            console.log(verifiedJwt);
        }
    })
    return isThere;
}

router.get('/', (req, res, next) => {
    const token = req.query.token;
    const credentials = req.headers.authorization;
    if (checkForToken(token)) {
        next();
    } else if (credentials !== undefined) {

    } else {

        res.status(401).send("No authorization to do this");
    }
});

module.exports = router;