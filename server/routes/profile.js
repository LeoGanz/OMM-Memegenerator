let express = require('express');
let router = express.Router();
const userSchema = require("../models/userSchema");
const {dbConnectionFailureHandler, respond} = require("../utils");


/**
 * This route gets all necessary information of the currently logged in user. Refer to
 * ProfileGetTemplate or the Readme for more information
 */
router.get('/', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const token = req.query.token;
    userSchema.find({currentToken: token}).populate('lastEdited').populate('lastComments').exec((err, lst) => {
        if (err) {
            dbConnectionFailureHandler(res, err)
        } else {
            if (lst.length === 0) {
                respond(res, 400, "Impossible Error: No meme with this memeId found");
            } else {
                const user = lst[0];
                console.log("User found:");
                if (err) {
                    respond(res, 500, 'No user found');
                } else {
                    const username = user.username;
                    const fullName = user.fullName;
                    const email = user.email;
                    let history = user.lastEdited;
                    let comments = user.lastComments;
                    const start = req.body.start ?? 0;
                    const end = req.body.end ?? 10;
                    history = history.slice(start, end);
                    let response = {
                        username: username,
                        fullName: fullName,
                        email: email,
                        memeHistory: history,
                        comments: comments
                    }
                    respond(res, 200, response);
                }
            }
        }
    });
});

module.exports = router;