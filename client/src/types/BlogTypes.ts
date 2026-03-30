import IUser from "./UserTypes";

export type ExploreSortField = "createdAt" | "bookmarkCounter";

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

export type CreateBlogValues = Pick<IBlog, "authorId" | "title" | "text"> & { image?: File | null };

export interface IComment extends Document {
    userId: IUser['_id'] | IUser;
    blogId: string;
    text: string;
    createdAt: Date;
}