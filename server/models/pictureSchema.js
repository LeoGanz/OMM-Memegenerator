const mongoose = require("mongoose");
const userSchema = require("./userSchema");
const commentSchema = require("./commentSchema");

const {Schema} = mongoose;

const pictureSchema = new Schema(
    {
        name: String,
        desc: String,
        img: {
            data: Buffer,
            contentType: String,
        },
        creator: userSchema,
        dateOfCreation: String,
        upVoters: [userSchema],
        downVoters: [userSchema],
        comments: [commentSchema],
        metadata: String,
        format: {width: Number, height: Number, pixels: Number}
    }
);

module.exports.default = mongoose.model('picture', pictureSchema);
module.exports = pictureSchema;