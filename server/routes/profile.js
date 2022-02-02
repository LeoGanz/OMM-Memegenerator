let express = require('express');
let router = express.Router();
const userSchema = require("../models/userSchema");
const utils = require("../utils");
const ut = new utils();


/**
 * This route gets all necessary information of the currently logged in user
 */
router.get('/', (req, res) => {
    const token = req.query.token;
    userSchema.find({currentToken: token}).populate('lastEdited').exec((err, lst) => {
        if (err) {
            ut.dbConnectionFailureHandler(res, err)
        } else {
            if (lst.length === 0) {
                ut.respond(res, 400, "Impossible Error: No meme with this memeId found");
            } else {
                const user = lst[0];
                console.log("User found:");
                if (err) {
                    ut.respond(res, 500, 'No user found');
                } else {
                    const username = user.username;
                    const fullName = user.fullName;
                    const email = user.email;
                    let history = user.lastEdited;
                    history = history.slice(req.body.start, req.body.end);
                    let response = {
                        username: username,
                        fullName: fullName,
                        email: email,
                        memeHistory: history
                    }
                    ut.respond(res, 200, response);
                }
            }
        }
    });
});

module.exports = router;