import {MemeType} from "./typedef";

interface ProfileCommentType {
    dateOfCreation: string,
    text: string,
    base64: string,
}

export interface ProfileData {
    username: string,
    fullName: string,
    email: string,
    memeHistory?: MemeType[],
    comments?: ProfileCommentType[],
}

