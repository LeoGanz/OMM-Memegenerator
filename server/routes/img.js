const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const mongoDB = 'mongodb://localhost:27017/images';
const imgSchema = require("../models/imageSchema");
const utils = require("../utils");
const ut = new utils();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + ut.giveBackDateString());
    }
});

const upload = multer({storage: storage});


router.get("",(req,res)=>{

})

module.exports = router;