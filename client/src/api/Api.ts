import axios from "axios";
import { ILoginValues, IRegisterValues } from "../types/LoginTypes";

// login function
export const login = async (data: ILoginValues): Promise<any> => {
    return axios.post("http://localhost:3001/api/user/login", data).then(response => response.data);
}

// register function
export const register = async (data: IRegisterValues): Promise<any> => {
    return axios.post("http://localhost:3001/api/user", data).then(response => response.data);
}