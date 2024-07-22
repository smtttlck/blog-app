export default interface IUser {
    _id: string;
    username: string;
    email: string;
    password: string;
    picture_path?: string;
}