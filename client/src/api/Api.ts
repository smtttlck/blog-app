import axios from "axios";
import { ILoginValues, IRegisterValues } from "../types/LoginTypes";
import { useSelector } from "react-redux";


// data fetch functions
export const fetchData = async (fetchString: string, token: string) => {
    const params: string[] = fetchString.split(/(?=[A-Z])/);
    let urlParams: string = params[1].toLowerCase(); // for table name
    const url: string = `http://localhost:3001/api/${urlParams}`; // fetch url

    // authorization add to headers
    axios.defaults.headers.common['authorization'] = `Bearer ${token}`;

    switch (params[0]) { // fetch
        case "get":
            return axios.get(url).then(response => response.data)
        // case "delete":
        //     return axios.delete(url)
        // case "put":
        //     return axios.put(url, data)
        // case "post":
        //     return axios.post(url, data)
    } 
}

// login function
export const login = async (data: ILoginValues): Promise<any> => {
    return axios.post("http://localhost:3001/api/user/login", data).then(response => response.data);
}

// register function
export const register = async (data: IRegisterValues): Promise<any> => {
    return axios.post("http://localhost:3001/api/user", data).then(response => response.data);
}