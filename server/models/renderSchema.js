const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const renderSchema = new Schema({
    memeId: String,
    dataUrl: String
});

module.exports = mongoose.model('render', renderSchema);