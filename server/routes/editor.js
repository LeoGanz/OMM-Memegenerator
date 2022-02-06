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
        .populate({
            path: 'comments',
            populate: [{path: 'dateOfCreation'}, {path: 'text'}, {path: 'creator', select: 'username'}]
        })
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
    userSchema
        .findOne({currentToken: req.query.token})
        .exec((err, creator) => {
            if (err) {
                dbConnectionFailureHandler(res, err)
            } else {
                if (!creator) {
                    respond(res, 400, "No user with this token found");
                } else {
                    const memeIdTemplate = req.body.memeId;
                    if (memeIdTemplate) {
                        memeSchema
                            .findOne({memeId: memeIdTemplate, status: 0})
                            .exec((err, template) => {
                                if (err) {
                                    dbConnectionFailureHandler(res, err)
                                } else {
                                    if (!template) {
                                        respond(res, 400, "There is no template with this memeId. " +
                                            "Providing a template is optional.")
                                    } else {
                                        processSingleMemeCreation(req.body, creator, res, template)
                                    }
                                }
                            });
                    } else {
                        processSingleMemeCreation(req.body, creator, res)
                    }
                }
            }
        });
});

module.exports = router;