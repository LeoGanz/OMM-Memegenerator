const mongoose = require("mongoose");
const User = require("./user");

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
    {
        dateOfCreation: String,
        creator: User,
        text: String,
    }
);

module.exports.default = mongoose.model('comment', CommentSchema);
module.exports = CommentSchema;