const mongoose = require("mongoose");
const User = require("./user");
const Comment = require("./comment");

const {Schema} = mongoose;

const PictureSchema = new Schema(
    {
        name: String,
        desc: String,
        img: {
            data: Buffer,
            contentType: String,
        },
        creator: User,
        dateOfCreation: String,
        upVoters: [User],
        downVoters: [User],
        comments: [Comment],
        metadata: String,
        format: {width: Number, height: Number, pixels: Number}
    }
);

module.exports = mongoose.model('picture', PictureSchema);
module.exports = PictureSchema;