let express = require('express');
let router = express.Router();
const userSchema = require("../models/userSchema");

router.get('/', (req, res) => {
    const token = req.query.token;
    userSchema.find({currentToken: token}, (err, lst) => {
        if (err) {
            console.log("503: Connection to db failed; error: " + err);
            res.status(503).send("Connection to db failed");
        } else {
            if (lst.length === 0) {
                console.log("400: Impossible Error: No picture with this metadata found");
                res.status(400).send("No picture with this metadata found");
            } else {
                const user = lst[0];
                console.log("200: User found");
                res.status(200).send(user);
            }
        }
    });
});

module.exports = router;