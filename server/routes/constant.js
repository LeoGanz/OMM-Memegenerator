var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.get((req, res, next) => {
    const jwt = require('njwt')
    const {token} = req.query;
    jwt.verify(token, 'top-secret', (err, verifiedJwt) => {
        if (err) {
            res.status(401).send(err.message)
        } else {
            // if verification successful, continue with next middlewares
            console.log(verifiedJwt)
            next()
        }
    })
})

module.exports = router;