export interface MemeType {
    name: string,
    desc: string,
    img: {
        base64: string,
    },
    creator: UserType,
    texts: MemeTextType[],
    dateOfCreation: string,
    upVoters?: UserType[],
    downVoters?: UserType[],
    comments?: CommentType[],
    memeId: string,
    status?: Number,
    format: { width: Number, height: Number, pixels: Number },
    usages?: Number,
}

export interface MemeInfoProps {
    setVoteHoverActive: (b: boolean) => any
    dateOfCreation: string,
    creator: string,
    comments: number,
    upVotes: number,
    downVotes: number,
    memeId: string
}


export interface CommentType {
    memeId: string,
    dateOfCreation: string,
    creator: UserType,
    text: string,
}


export interface MemeTextType {
    text: string,
    xCoordinate: Number,
    yCoordinate: Number,
    // distorted text possible with xSize and ySize
    // xSize: Number,
    // ySize: Number,
    fontSize: Number, // in px
    color: string // CSS color string
    //things addable here
}

export interface UserType {
    username: string,
    fullName?: string,
    password?: string,
    currentToken?: string,
    email?: string,
    //accounts: ...
    dateOfCreation?: string,
    lastEdited?: MemeType[],
    lastComments?: CommentType[],
}

export interface SingleCommentType {
    dateOfCreation: string,
    username: string,
    text: string
}
export interface SingleMemeType {
    name: string,
    desc: string,
    creator: string,
    dateOfCreation: string,
    upVotes: number,
    downVotes: number,
    comments: SingleCommentType[],
    dataUrl: string,
    memeId: string
}























