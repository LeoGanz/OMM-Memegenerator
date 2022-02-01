let express = require('express');
let router = express.Router();
const userSchema = require("../models/userSchema");
const utils = require("../utils");
const ut = new utils();

router.get('/', (req, res) => {
    const token = req.query.token;
    userSchema.find({currentToken: token}, (err, lst) => {
        if (err) {
            ut.dbConnectionFailureHandler(res, err)
        } else {
            if (lst.length === 0) {
                ut.respond(res, 400, "Impossible Error: No meme with this memeId found");
            } else {
                const user = lst[0];
                console.log("User found:");
                ut.respond(res, 200, user);
            }
        }
    });
});

module.exports = router;