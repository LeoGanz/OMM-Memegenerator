const express = require('express');
const mongoose = require("mongoose");
const jwt = require("njwt");
const router = express.Router();
const mongoDB = 'mongodb://localhost:27017';

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
        mongoose.connect(mongoDB).then(()=> {

        }).catch(()=>{
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