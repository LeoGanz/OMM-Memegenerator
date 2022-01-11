const express = require('express');
const mongoose = require("mongoose");
const jwt = require("njwt");
const router = express.Router();
const mongoDB = 'mongodb://localhost:27017/users';
let utils = require("../utils");
let ut = new utils();
let userSchema = require("../models/userSchema.js");

router.post("/", (req, res) => {
    // console.log("route reached");
    let token = req.query.token
    if(token === undefined){
        token = ""
    }
    jwt.verify(token, "top-secret", (err) => {
            if (err) {
                if (req.headers.authorization !== undefined) {
                    console.log("502: you already have an account");
                    res.status(502).send("You already have an account");
                } else {
                    mongoose.connect(mongoDB).then(() => {
                        mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
                        console.log('db connection initiated');

                        let username = req.body.username;
                        let fullName = req.body.fullName;
                        let password = req.body.password;
                        let email = req.body.email;

                        userSchema.find({username: username}, (err, lst) => {
                            if (err) {
                                console.log("503: Connection to db failed; error: " + err);
                                res.status(503).send("Connection to db failed");
                            } else {
                                if (lst.length === 0) {
                                    userSchema.find({fullName: fullName}, (err, lst) => {
                                        if (err) {
                                            console.log("503: Connection to db failed; error: " + err);
                                            res.status(503).send("Connection to db failed");
                                        } else {
                                            if (lst.length === 0) {
                                                userSchema.find({email: email}, (err, lst) => {
                                                    if (err) {
                                                        console.log("503: Connection to db failed; error: " + err);
                                                        res.status(503).send("Connection to db failed");
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
                                                                res.status(200).send(tokenString);
                                                            });
                                                        } else {
                                                            console.log("502: this email already has an account");
                                                            res.status(502).send("This email already has an account");
                                                        }
                                                    }
                                                });
                                            } else {
                                                console.log("502: you already have an account");
                                                res.status(502).send("You already have an account");
                                            }
                                        }
                                    });
                                } else {
                                    console.log("502: username already exists");
                                    res.status(502).send("username already exists");
                                }
                            }
                        });


                    }).catch(err => {
                        console.log("503: Connection to db failed; error: " + err);
                        res.status(503).send("Connection to db failed");
                    });
                }
            } else {
                console.log("503: No logged-in user can register a user");
                res.status(503).send("No logged-in user can register a user");
            }
        }
    )
});

module.exports = router;