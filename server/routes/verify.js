const express = require('express');
const router = express.Router();
const utils = require('../utils');
const ut = new utils();

/**
 * This route serves as a verification route for njwt-tokens from the query
 */
router.get('/', (req, res) => {
    ut.jwtVerify(req, _ => {
        ut.respond(res,200, true);
    }, _ => {
        ut.respond(res,200, false);
    });
});

module.exports = router;