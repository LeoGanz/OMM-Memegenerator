let express = require('express');
let router = express.Router();
const utils = require("../utils");
const {getOrRenderMeme} = require("../renderManager");
const ut = new utils();

router.get("/", (req, res) => {
    const memeId = req.query.memeId;
    getOrRenderMeme(memeId,
        dataUrl => ut.collectMetadata(memeId, metadata => ut.respondSilently(res, 200, {
            metadata: metadata,
            dataUrl: dataUrl,
        }), err => ut.dbConnectionFailureHandler(res, err), () => ut.noMemeFoundHandler(res)),
        () => ut.noMemeFoundHandler(res),
        err => ut.dbConnectionFailureHandler(res, err)
    );
});

module.exports = router;