import axios from "axios";
import { ILoginValues, IRegisterValues, LoginResponse } from "../types/LoginTypes";

// data fetch functions
export const fetchData = async (fetchString: string, token: string, queryString: string | null, data: any = null) => {

    const params: string[] = fetchString.split(/(?=[A-Z])/);
    let urlParams: string = params[1].toLowerCase(); // for table name

    if (queryString) // paramater for query
        urlParams += queryString

    const url: string = `http://${process.env.API_BASE_URL}/api/${urlParams}`; // fetch url

    // authorization add to headers
    axios.defaults.headers.common['authorization'] = `Bearer ${token}`;

    switch (params[0]) { // fetch
        case "get": // get request
            return axios.get(url).then(response => response.data);
        case "post": // post request
            return axios.post(url, data);
        case "delete": // delete request
            return axios.delete(url, { data });
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