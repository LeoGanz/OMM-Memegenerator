import mongoose from "mongoose";
import User from "./user";
import Comment from "./comment";

const Schema = mongoose.Schema;

const PictureSchema = new Schema(
    {
        name: String,
        desc: String,
        img:{
            data: Buffer,
            contentType: String,
        },
        creator: User,
        dateOfCreation: String,
        upVoters: [User],
        downVoters: [User],
        comments: [Comment],
        metadata: String,
        format: {width: Number, height: Number, pixels: Number},
    }
);

export default mongoose.model('picture', PictureSchema);