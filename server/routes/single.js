let express = require('express');
let router = express.Router();
const {getOrRenderMemeToSize} = require("../renderManager");
const {collectMetadata, respondSilently, noMemeFoundHandler, dbConnectionFailureHandler} = require("../utils");

router.get("/", (req, res) => {
    const memeId = req.query.memeId;
    const targetFileSize = req.query.targetFileSize; // optional
    getOrRenderMemeToSize(memeId, targetFileSize,
        dataUrl => collectMetadata(memeId, metadata => respondSilently(res, 200, {
            metadata: metadata,
            dataUrl: dataUrl,
        }), err => dbConnectionFailureHandler(res, err), () => noMemeFoundHandler(res)),
        () => noMemeFoundHandler(res),
        err => dbConnectionFailureHandler(res, err)
    );
});

module.exports = router;