export default interface IUser { // user interface
    _id: string;
    username: string;
    email: string;
    password: string;
    picture_path?: string;
}

export interface IUserWithFollowStatus extends IUser { // user with follow status interface
    isFollowed: boolean; // indicates if the current user follows this user
}