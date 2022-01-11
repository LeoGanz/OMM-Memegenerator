let express = require('express');
let router = express.Router();
const mongoose = require("mongoose");
const mongoDB = 'mongodb://localhost:27017/users';
const userSchema = require("../models/userSchema");

/* GET users in DB. */
router.get('/', function (req, res) {
    mongoose.connect(mongoDB).then(() => {
        mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
        console.log('db connection initiated');
        userSchema.find({}, (err, lst) => {
            if (err) {
                res.status(500).send("Some problem with the database");
            } else {
                res.send(lst);
            }
        });
    }).catch((err) => {
        if (err){
            console.log(err);
        console.log("503: Connection to db failed");
        res.status(503).send("Connection to db failed");
        }
    });
});

module.exports = router;
