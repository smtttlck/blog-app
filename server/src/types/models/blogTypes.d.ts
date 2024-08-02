import { Document, Types } from "mongoose";

export interface IBlog extends Document {
    authorId: Types.ObjectId;
    title: string;
    text: string;
    bookmarkCounter: number;
    commentCounter: number;
    picture_path?: string;
    isBookmarked?: boolean;
    created_date: Date;
    updated_date: Date;
}

export interface IComment extends Document {
    userId: Types.ObjectId;
    blogId: Types.ObjectId;
    text: string;
    createdAt: Date;
}