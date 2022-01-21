let express = require('express');
let router = express.Router();
const pictureSchema = require("../models/pictureSchema");

router.get("/", (req, res) => {
    const metadata = req.query.metadata;
    pictureSchema.find({metadata:metadata}, (lst,err) => {
        if (err){
            console.log("400: No picture with this metadata found");
            res.status(400).send("No picture with this metadata found");
        }else{
            const pict = lst[0];
            console.log("200: Picture found");
            res.status(200).send(pict);
        }
    });
});

module.exports = router;