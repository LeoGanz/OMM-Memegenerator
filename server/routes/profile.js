let express = require('express');
let router = express.Router();
const userSchema = require("../models/userSchema");
const memeSchema = require("../models/memeSchema");
const {dbConnectionFailureHandler, respond, respondSilently} = require("../utils");


function findMemeBasesAndRespond(comments, memeComments, res, response) {
    if (comments.length === 0) {
        response.comments = memeComments;
        respond(res, 200, response);
    } else {
        let comm = comments.shift();
        console.log(comm.memeId);
        memeSchema.find({memeId: comm.memeId}, (err, lst) => {
            if (err) {
                respondSilently(res, 500, "Connection to memeDatabase failed");
            } else {
                console.log(lst[0]);
                const base = lst[0].img.base64;
                const newComm = {
                    dateOfCreation: comm.dateOfCreation,
                    text: comm.text,
                    base64: base
                }
                memeComments.push(newComm);
                findMemeBasesAndRespond(comments,memeComments, res, response);
            }
        });
    }
}


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
                respond(res, 400, "Impossible Error: No user with this token found");
            } else {
                const user = lst[0];
                const username = user.username;
                const fullName = user.fullName;
                const email = user.email;
                let history = user.lastEdited;
                let comments = user.lastComments;
                const start = req.query.start ?? 0;
                const end = req.query.end ?? 5;
                history = history.slice(start, end);
                comments = comments.slice(start, end);
                let response = {
                    username: username,
                    fullName: fullName,
                    email: email,
                    memeHistory: history,
                }
                findMemeBasesAndRespond(comments, [], res, response);
            }
        }
    });
});

module.exports = router;