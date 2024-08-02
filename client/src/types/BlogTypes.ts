import IUser from "./UserTypes";

export default interface IBlog {
    _id: string;
    authorId: IUser['_id'] | IUser;
    title: string;
    text: string;
    picture_path?: string;
    isBookmarked?: boolean;
    commentCounter?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IComment extends Document {
    userId: IUser['_id'] | IUser;
    blogId: string;
    text: string;
    createdAt: Date;
}