import axios from "axios";
import { ILoginValues, IRegisterValues, LoginResponse } from "../types/LoginTypes";

// data fetch functions
export const fetchData = async (fetchString: string, token: string, queryString: string | null, data: any = null) => {

    const params: string[] = fetchString.split(/(?=[A-Z])/);
    let urlParams: string = params[1].toLowerCase(); // for table name

    if (queryString) // paramater for query
        urlParams += queryString

    const authHeaders = { authorization: `Bearer ${token}` }; // authorization add to headers
    let requestHeaders: Record<string, string> = authHeaders; // default headers

    // convert form data(for image files)
    if (fetchString.startsWith("putUser") || fetchString.startsWith("postBlog")) {
        const formData = new FormData()

        for (const key in data) {
            const value = data[key];

            if (value === undefined || value === null)
                continue;

            if (fetchString.startsWith("putUser") && key === 'picture_path' && typeof value === 'string' && value.startsWith('data:image')) {
                const response = await fetch(value);
                const blob = await response.blob();
                formData.append('image', blob, 'profile.jpg');
                continue;
            }

            if (fetchString.startsWith("putUser") && key === 'image') {
                formData.append('image', {
                    uri: value.uri,
                    name: value.name || 'profile.jpg',
                    type: value.type || 'image/jpeg'
                } as any);
                continue;
            }

            if (fetchString.startsWith("postBlog") && key === 'image') {
                formData.append('image', {
                    uri: value.uri,
                    name: value.name || 'blog.jpg',
                    type: value.type || 'image/jpeg'
                } as any);
                continue;
            }

            formData.append(key, value)
        }

        data = formData;
        requestHeaders = {
            ...authHeaders,
            'Content-Type': 'multipart/form-data'
        };
    }

    const url: string = `http://${process.env.API_BASE_URL}/api/${urlParams}`; // fetch url

    switch (params[0]) { // fetch
        case "get": // get request
            return axios.get(url, { headers: requestHeaders }).then(response => response.data);
        case "post": // post request
            return axios.post(url, data, { headers: requestHeaders });
        case "delete": // delete request
            return axios.delete(url, { data, headers: requestHeaders });
        case "put": // put request
            return axios.put(url, data, { headers: requestHeaders });
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