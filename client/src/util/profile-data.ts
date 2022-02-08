import {CommentType, MemeType} from "./typedef";

export interface ProfileData {
    username: string,
    fullName: string,
    email: string,
    memeHistory?: MemeType[],
    comments?: CommentType[],
}

