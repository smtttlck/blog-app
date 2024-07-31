import IUser from "./UserTypes";

export default interface IBlog {
    _id: string;
    authorId: IUser['_id'] | IUser;
    title: string;
    text: string;
    picture_path?: string;
    isBookmarked?: boolean;
    createdAt: Date;
    updatedAt: Date;
}