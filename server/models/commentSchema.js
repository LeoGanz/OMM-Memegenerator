const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        dateOfCreation: String,
        creator: {type: Schema.Types.ObjectId, ref:'user'},
        text: String,
    }
);

module.exports = mongoose.model('comment', commentSchema);