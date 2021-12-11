const mongoose = require("mongoose");
const userSchema = require("./userSchema");

const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        dateOfCreation: String,
        creator: userSchema,
        text: String,
    }
);

module.exports.default = mongoose.model('comment', commentSchema);
module.exports = commentSchema;