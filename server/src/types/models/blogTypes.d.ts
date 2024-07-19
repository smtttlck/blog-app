import { Document, Types } from "mongoose";

export interface IBlog extends Document {
    authorId: Types.ObjectId;
    title: string;
    text: string;
    picture_path?: string;
    created_date: Date;
    updated_date: Date;
}