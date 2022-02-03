const express = require('express');
const router = express.Router();
let userSchema = require("../models/userSchema.js");
const {jwtVerify, respond, dbConnectionFailureHandler, createToken, getCurrentDateString} = require("../utils");

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
            dbConnectionFailureHandler(res, err)
        } else {
            if (lst.length === 0) {

                // console.log(req.body)
                // console.log(username, fullName, password, email);


                //Main code
                let creationDate = getCurrentDateString();
                let hashedPw = password;
                let tokenString = createToken(email);


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
                    respond(res, 200, tokenString);
                });
            } else {
                respond(res, 502, "This email already has an account");
            }
        }
    });
}


/**
 * This route registers a user to the platform. For more information look into
 * RegisterTestUser.txt or the Readme.
 */
router.post("/", (req, res) => {
    // console.log("route reached");
    res.set('Access-Control-Allow-Origin', '*');
    jwtVerify(req, _ => {
        respond(res, 503, "No logged-in user can register a user");
    }, _ => {
        if (req.headers.authorization !== undefined) {
            respond(res, 502, "You already have an account");
        } else {
            let username = req.body.username;
            let fullName = req.body.fullName;
            let password = req.body.password;
            let email = req.body.email;

            userSchema.find({username: username}, (err, lst) => {
                if (err) {
                    dbConnectionFailureHandler(res, err)
                } else {
                    if (lst.length === 0) {
                        userSchema.find({fullName: fullName}, (err, lst) => {
                            if (err) {
                                respond(res, 503, "Connection to db failed", err);
                            } else {
                                if (lst.length === 0) {
                                    addUserIfEmailDoesNotExist(email, password, username, fullName, res);
                                } else {
                                    respond(res, 502, "You already have an account");
                                }
                            }
                        });
                    } else {
                        respond(res, 502, "username already exists");
                    }
                }
            });
        }
    });
});

module.exports = router;