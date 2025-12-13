import axios from "axios";
import { ILoginValues, IRegisterValues, LoginResponse } from "../types/LoginTypes";

// data fetch functions
export const fetchData = async (fetchString: string, token: string, queryString: string | null) => {

    const params: string[] = fetchString.split(/(?=[A-Z])/);
    let urlParams: string = params[1].toLowerCase(); // for table name

    if (queryString) // paramater for query
        urlParams += queryString

    const url: string = `http://${process.env.API_BASE_URL}/api/${urlParams}`; // fetch url

    // authorization add to headers
    axios.defaults.headers.common['authorization'] = `Bearer ${token}`;

    switch (params[0]) { // fetch
        case "get":
            return axios.get(url).then(response => response.data);
    } 
}

// login function
export const login = async (data: ILoginValues): Promise<LoginResponse> => {
    return axios.post<LoginResponse>(`http://${process.env.API_BASE_URL}/api/user/login`, data).then(response => response.data);
}

// register function
export const register = async (data: IRegisterValues): Promise<LoginResponse> => {
    return axios.post(`http://${process.env.API_BASE_URL}/api/user`, data).then(response => response.data);
}