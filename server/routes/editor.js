const express = require('express');
const router = express.Router();
const memeSchema = require("../models/memeSchema");
const userSchema = require("../models/userSchema");
const {processSingleMemeCreation} = require("../memeUploadHandler");
const {dbConnectionFailureHandler, cleanMeme, respondSilently, respond} = require("../utils");

router.get('/', (req, res) => {
    memeSchema
        .find({})
        .populate('texts')
        // do not populate whole creator as this would leak private data
        .populate('creator', 'username')
        .populate('upVoters.username')
        .populate('downVoters.username')
        .populate({path: 'comments', select: ['dateOfCreation', 'text', 'creator.username']})
        .exec((err, memes) => {
            if (err) {
                dbConnectionFailureHandler(res, err)
            } else {
                if (memes.length === 0) {
                    respond(res, 400, "No meme with this memeId found");
                } else {
                    let templates = memes.filter((meme) => {
                        return meme.status === 0;
                    });
                    const start = req.body.start ?? 0;
                    const end = req.body.end ?? 10;
                    templates = templates.slice(start, end);
                    let wanted = memes.filter((meme) => {
                        return meme.memeId = req.query.memeId;
                    });
                    let toSend = {
                        wanted: wanted.map(cleanMeme),
                        templates: templates.map(cleanMeme),
                    }
                    respondSilently(res, 200, toSend);
                }
            }
        });
});

router.post('/', (req, res) => {
    userSchema.find({currentToken: req.query.token}, (err, lst) => {
        if (err) {
            dbConnectionFailureHandler(res, err)
        } else {
            if (lst.length === 0) {
                respond(res, 400, "No user with this token found");
            }
            processSingleMemeCreation(req.body, lst[0], res)
        }
    });
});

module.exports = router;