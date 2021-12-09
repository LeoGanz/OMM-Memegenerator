const express = require('express');
const mongoose = require("mongoose");
const jwt = require("njwt");
const router = express.Router();
const mongoDB = 'mongodb://localhost:27017/user';
const md5 = require('md5');


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

function checkUsernameInDatabase(db, username) {
    let lst;
    db.collection("users").findOne({username: username}, (err, l) => {
        if (err) {
            lst = [];
        } else {
            lst = l;
        }
    });
    return lst;
}

function checkEmailInDatabase(db, email) {
    let lst;
    db.collection("users").findOne({email: email}, (err, l) => {
        if (err) {
            lst = [];
        } else {
            lst = l;
        }
    });
    return lst;
}

function checkFullNameInDatabase(db, fullName) {
    let lst;
    db.collection("users").findOne({fullName: fullName}, (err, l) => {
        if (err) {
            lst = [];
        } else {
            lst = l;
        }
    });
    return lst;
}

function checkForFullnessAndPrint(users, fullNames, emails) {
    if (users.length > 0 && fullNames.length > 0 && emails.length > 0) {
        return true;
    } else {
        if (users.length === 0) {
            console.log("Username already exists");
        }
        if (fullNames.length === 0) {
            console.log("You are already registered");
        }
        if (emails.length === 0) {
            console.log("There already exist a user with this email")
        }
        return false;
    }
}

function giveBackDateString() {
    const today = new Date();
    const creationDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
        + '--' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return creationDate;
}

function createToken(name) {
    const claims = {username: name};
    const token = jwt.create(claims, 'top-secret');
    const jwtTokenString = token.compact();
    return jwtTokenString;
}

router.post("/", (req, res, next) => {
    if (!checkForToken(req.query.token)) {
        if (req.headers.authorization !== null) {
            next();
        } else {
            mongoose.connect(mongoDB).then(() => {
                const db = mongoose.connection;
                db.on('error', console.error.bind(console, 'MongoDB connection error:'));
                console.log('db connection initiated');

                let username = req.query.username;
                let fullName = req.query.fullName;
                let password = req.query.password;
                let email = req.query.email;

                let foundUsers = checkUsernameInDatabase(db, username);
                let foundFullNames = checkFullNameInDatabase(db, fullName);
                let foundEmails = checkEmailInDatabase(db, email);

                if (checkForFullnessAndPrint(foundUsers, foundFullNames, foundEmails)) {

                    //Main code
                    let creationDate = giveBackDateString();
                    let hashedPw = md5(password);
                    let tokenString = createToken(username);

                    const user = new User({
                        username: username,
                        fullName: fullName,
                        password: hashedPw,
                        currentToken: tokenString,
                        email: email,
                        dateOfCreation: creationDate,
                        lastEdited: [],
                        lastComments: [],
                    });

                    db.collection("users").insertOne(user).then(() => {
                        res.send(username + " " + hashedPw + " " + tokenString);
                        next()
                    });
                } else {
                    console.log("502: Some of the given user parameters already exists");
                    res.status(502).send("Some of the given user parameters already exists");
                    return;
                }

            }).catch(() => {
                console.log("503: Connection do db failed");
                res.status(503).send("Connection do db failed");
                return;
            });
        }
    } else {
        console.log("503: No logged-in user can register a user");
        res.status(503).send("No logged-in user can register a user");
        return;
    }
});

module.exports = router;