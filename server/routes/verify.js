const express = require('express');
const router = express.Router();
const {jwtVerify, respond} = require("../utils");

/**
 * This route serves as a verification route for njwt-tokens from the query
 */
router.get('/', (req, res) => {
    jwtVerify(req, _ => {
        respond(res, 200, true);
    }, _ => {
        respond(res, 200, false);
    });
});

module.exports = router;