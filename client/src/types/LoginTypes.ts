export interface ILoginValues {
    username: string;
    password: string;
}

export interface IRegisterValues extends ILoginValues {
    email: string;
}