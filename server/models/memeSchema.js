const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * This schema describes how every meme is structered
 * @type {module:mongoose.Schema<any, Model<any, any, any, any>, any, any>}
 */
const memeSchema = new Schema(
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
        memeId: String,
        status: Number,
        format: {width: Number, height: Number, pixels: Number},
        usages: Number,
    }
);

module.exports = mongoose.model('meme', memeSchema);