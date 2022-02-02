const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * This schema maps memeIds to dataUrls for rendering purposes
 * @type {module:mongoose.Schema<any, Model<any, any, any, any>, any, any>}
 */
const renderSchema = new Schema({
    memeId: String,
    dataUrl: String
});

module.exports = mongoose.model('render', renderSchema);