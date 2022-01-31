const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const renderSchema = new Schema({
    metadata: String,
    dataUrl: String
});

module.exports = mongoose.model('render', renderSchema);