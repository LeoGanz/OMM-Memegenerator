const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const pictureSchema = new Schema(
    {
        name: String,
        desc: String,
        img: {
            // data: Buffer,
            // contentType: String,
            base64: String,
            // mimeType: String // image/jpeg or image/png
        },
        creator: {type: Schema.Types.ObjectId, ref: 'user'},
        texts:[{type: Schema.Types.ObjectId, ref: 'text'}],
        dateOfCreation: String,
        upVoters: [{type: Schema.Types.ObjectId, ref: 'user'}],
        downVoters: [{type: Schema.Types.ObjectId, ref: 'user'}],
        comments: [{type: Schema.Types.ObjectId, ref: 'comment'}],
        metadata: String,
        status: Number,
        format: {width: Number, height: Number, pixels: Number},
        usage: Number,
    }
);

module.exports = mongoose.model('picture', pictureSchema);