const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const pictureSchema = new Schema(
    {
        name: String,
        desc: String,
        img: {
            data: Buffer,
            contentType: String,
        },
        creator: {type: Schema.Types.ObjectId, ref: 'user'},
        dateOfCreation: String,
        upVoters: [{type: Schema.Types.ObjectId, ref: 'user'}],
        downVoters: [{type: Schema.Types.ObjectId, ref: 'user'}],
        comments: [{type: Schema.Types.ObjectId, ref: 'comment'}],
        metadata: String,
        format: {width: Number, height: Number, pixels: Number}
    }
);

module.exports = mongoose.model('picture', pictureSchema);