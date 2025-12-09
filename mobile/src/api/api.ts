import axios from "axios";
import { ILoginValues, IRegisterValues, LoginResponse } from "../types/LoginTypes";

// login function
export const login = async (data: ILoginValues): Promise<LoginResponse> => {
    return axios.post<LoginResponse>(`http://${process.env.API_BASE_URL}/api/user/login`, data).then(response => response.data);
}

// register function
export const register = async (data: IRegisterValues): Promise<LoginResponse> => {
    return axios.post(`http://${process.env.API_BASE_URL}/api/user`, data).then(response => response.data);
}