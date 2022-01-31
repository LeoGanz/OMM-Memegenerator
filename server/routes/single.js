let express = require('express');
let router = express.Router();
const utils = require("../utils");
const {getOrRenderMeme} = require("../renderManager");
const ut = new utils();

router.get("/", (req, res) => {
    const metadata = req.query.metadata;
    getOrRenderMeme(metadata,
        dataUrl => ut.respondSilently(res, 200, dataUrl),
        () => ut.respond(res, 400, "No picture with this metadata found"),
        err => ut.respond(res, 503, "Connection to db failed", err)
    );
});

module.exports = router;