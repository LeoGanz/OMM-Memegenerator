const express = require('express');
const mongoose = require("mongoose");
const jwt = require("njwt");
const router = express.Router();
const mongoDB = 'mongodb://localhost:27017/users';
const md5 = require('md5');
let utils = require("../utils");
let ut = new utils();
let userSchema = require("../models/userSchema.js");

router.post("/", (req, res, next) => {
    // console.log("route reached");
    if (!ut.checkForToken(req.query.token)) {
        if (req.headers.authorization !== undefined) {
            console.log("authorized user: " + req.headers.authorization);
            next();
        } else {
            mongoose.connect(mongoDB).then(() => {
                const db = mongoose.connection;
                db.on('error', console.error.bind(console, 'MongoDB connection error:'));
                console.log('db connection initiated');

                let username = req.body.username;
                let fullName = req.body.fullName;
                let password = req.body.password;
                let email = req.body.email;

                let foundUsers = ut.checkInDB(userSchema, {username: username});
                let foundFullNames = ut.checkInDB(userSchema, {fullName: fullName});
                let foundEmails = ut.checkInDB(userSchema, {email: email});

                console.log(foundUsers, foundFullNames, foundEmails);
                // console.log(req.body)
                // console.log(username, fullName, password, email);

                if (checkForFullnessAndPrint(foundUsers, foundFullNames, foundEmails)) {

                    //Main code
                    let creationDate = ut.giveBackDateString();
                    let hashedPw = password;
                    let tokenString = createToken(username);


                    // console.log("everything defined");
                    // const users = mongoose.model('users', userSchema);
                    const user = new userSchema({
                        username: username,
                        fullName: fullName,
                        password: hashedPw,
                        currentToken: tokenString,
                        email: email,
                        dateOfCreation: creationDate,
                        lastEdited: [],
                        lastComments: [],
                    });
                    // console.log(creationDate);
                    userSchema.create(user).then(_ => {
                        console.log("registration succeeded");
                        next();
                    });
                } else {
                    console.log("502: Some of the given user parameters already exists");
                    res.status(502).send("Some of the given user parameters already exists");
                    return;
                }

            }).catch(err => {
                console.log("503: Connection to db failed; error: " + err);
                res.status(503).send("Connection to db failed");
                return;
            });
        }
    } else {
        console.log("503: No logged-in user can register a user");
        res.status(503).send("No logged-in user can register a user");
        return;
    }
});

function checkForFullnessAndPrint(users, fullNames, emails) {
    if ((users === undefined || users.length === 0) && (users === undefined || fullNames.length === 0) && (emails === undefined || emails.length === 0)) {
        return true;
    } else {
        if (users.length !== 0) {
            console.log("Username already exists");
        }
        if (fullNames.length !== 0) {
            console.log("You are already registered");
        }
        if (emails.length !== 0) {
            console.log("There already exist a user with this email")
        }
        return false;
    }
}

function createToken(name) {
    const claims = {username: name};
    const token = jwt.create(claims, 'top-secret');
    const jwtTokenString = token.compact();
    return jwtTokenString;
}

module.exports = router;