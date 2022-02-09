let express = require('express');
let router = express.Router();
const {getOrRenderMemeToSize} = require("../renderManager");
const {collectMetadata, respondSilently, noMemeFoundHandler, dbConnectionFailureHandler, respond} = require("../utils");
const {getMatchingItems} = require("./img");

router.get("/", (req, res) => {
    const memeId = req.query.memeId;
    const targetFileSize = req.query.targetFileSize; // optional
    const filterBy = req.query.filterBy; // filter by username
    const sortBy = req.query.sortBy;
    const userToken = req.query.token;

    const onError = err => dbConnectionFailureHandler(res, err);
    const onNothingFound = () => noMemeFoundHandler(res);

    getOrRenderMemeToSize(memeId, targetFileSize,
        dataUrl => collectMetadata(memeId,
            metadata => {
                getMatchingItems(metadata.status, filterBy, sortBy, userToken,
                    items => {
                        const mainIndex = items.findIndex(meme => meme.memeId === memeId);
                        // access indices with wrap around
                        const prev = items[(mainIndex - 1 + items.length) % items.length]
                        const next = items[(mainIndex + 1) % items.length]
                        respondSilently(res, 200, {
                            metadata: metadata,
                            dataUrl: dataUrl,
                            prev: prev ? prev.memeId : "No previous meme found",
                            next: next ? next.memeId : "No next meme found"
                        });
                    },
                    onError,
                    onNothingFound,
                    msg => respond(res, 400, msg));
            },
            onError,
            onNothingFound),
        onNothingFound,
        onError
    );
});

module.exports = router;