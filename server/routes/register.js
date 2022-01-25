const express = require('express');
const jwt = require("njwt");
const router = express.Router();
let utils = require("../utils");
let ut = new utils();
let userSchema = require("../models/userSchema.js");

/**
 * Creates a user if the user is not in the database
 * @param email The email of the user
 * @param password The password of the user
 * @param username The username of the user
 * @param fullName The full name of the user
 * @param res the result to be given back
 */
function addUserIfEmailDoesNotExist(email, password, username, fullName, res) {
    userSchema.find({email: email}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db failed; error: " + err);
            ut.sendIfNotAlready(res, 503, "Connection to db failed");
        } else {
            if (lst.length === 0) {

                // console.log(req.body)
                // console.log(username, fullName, password, email);


                //Main code
                let creationDate = ut.giveBackDateString();
                let hashedPw = password;
                let tokenString = ut.createToken(email);


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
                    ut.sendIfNotAlready(res, 200, tokenString);
                });
            } else {
                console.log("502: this email already has an account");
                ut.sendIfNotAlready(res, 502, "This email already has an account");
            }
        }
    });
}

router.post("/", (req, res) => {
    // console.log("route reached");
    let token = ut.adjustToken(req);
    jwt.verify(token, "top-secret", (err) => {
            if (err) {
                if (req.headers.authorization !== undefined) {
                    console.log("502: you already have an account");
                    ut.sendIfNotAlready(res, 502, "You already have an account");
                } else {
                    let username = req.body.username;
                    let fullName = req.body.fullName;
                    let password = req.body.password;
                    let email = req.body.email;

                    userSchema.find({username: username}, (err, lst) => {
                        if (err) {
                            console.log("503: Connection to db failed; error: " + err);
                            ut.sendIfNotAlready(res, 503, "Connection to db failed");
                        } else {
                            if (lst.length === 0) {
                                userSchema.find({fullName: fullName}, (err, lst) => {
                                    if (err) {
                                        console.log("503: Connection to db failed; error: " + err);
                                        ut.sendIfNotAlready(res, 503, "Connection to db" +
                                            " failed");
                                    } else {
                                        if (lst.length === 0) {
                                            addUserIfEmailDoesNotExist(email, password, username, fullName, res);
                                        } else {
                                            console.log("502: you already have an account");
                                            ut.sendIfNotAlready(res, 502, "You already have" +
                                                " an" +
                                                " account");
                                        }
                                    }
                                });
                            } else {
                                console.log("502: username already exists");
                                ut.sendIfNotAlready(res, 502, "username already exists");
                            }
                        }
                    });
                }
            } else {
                console.log("503: No logged-in user can register a user");
                ut.sendIfNotAlready(res, 503, "No logged-in user can register a user");
            }
        }
    )
});

module.exports = router;