import axios, { AxiosResponse, Method } from "axios";

const APIClient = async<T>(url: string, method: Method, body?: any):Promise<T> => {
    try {
        const config = {
            method,
            url,
            data: body,
            withCredentials: true
        };

        const response: AxiosResponse<T> = await axios(config);
        return response.data;
    }
    catch (e:any) {
        console.log(e, "Error in API Client");
        throw e.response?.data || e.message;
    }
}

export { APIClient }