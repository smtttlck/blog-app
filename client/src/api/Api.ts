import axios from "axios";
import { ILoginValues, IRegisterValues } from "../types/LoginTypes";


// data fetch functions
export const fetchData = async (fetchString: string, token: string, data: any, queryString: string | null) => {
    const params: string[] = fetchString.split(/(?=[A-Z])/);
    let urlParams: string = params[1].toLowerCase(); // for table name
    if (queryString) // paramater for query
        urlParams += queryString
    const url: string = `http://localhost:3001/api/${urlParams}`; // fetch url


    // convert form data(for image files)
    if (fetchString == "postBlog") {
        const formData = new FormData()
        for (const key in data) {
                    formData.append(key, data[key])
        }
        data = formData
    }

    // authorization add to headers
    axios.defaults.headers.common['authorization'] = `Bearer ${token}`;

    switch (params[0]) { // fetch
        case "get":
            return axios.get(url).then(response => response.data)
        case "post":
            return axios.post(url, data)
        case "delete":
            return axios.delete(url)
        case "put":
            return axios.put(url, data)
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