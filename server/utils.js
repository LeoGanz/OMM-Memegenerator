const express = require('express');
const mongoose = require("mongoose");
const jwt = require("njwt");
const mongoDB = 'mongodb://localhost:27017';

module.exports = function () {
    this.checkForToken = function (token) {
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
        });
        return isThere;
    };
}


