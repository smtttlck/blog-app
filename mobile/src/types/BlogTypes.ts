export default interface IBlog { // blog post interface
    _id: string;
    authorId: {
        _id: string;
        username: string;
        email: string;
        picture_path: string;
        __v: number;
    };
    title: string;
    text: string;
    picture_path?: string;
    isBookmarked?: boolean;
    commentCounter?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IComment { // comment interface
    _id?: string;
    userId: {
        _id: string;
        username: string;
        email: string;
        picture_path: string;
        __v: number;
    };
    blogId: string;
    text: string;
    createdAt: Date;
}