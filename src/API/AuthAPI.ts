import { APIClient } from "./APIClient";
import { BASE_URL } from "../utils/constants";
import { LoginResponseType, LoginType, SessionResponseType, SignupResponseType, SignupType } from "../Types/AuthAPI.types";

const LoginAPI = async (body: LoginType): Promise<LoginResponseType> => {
    try {
        const url = `${BASE_URL}/login`;
        return await APIClient<LoginResponseType>(url, "POST", { emailId: body.emailId, password: body.password });
    }
    catch (error) {
        console.log(error, "Error in Login API");
        throw error;
    }
}


const SignupAPI = async (body: SignupType): Promise<SignupResponseType> => {
    try {
        const url = `${BASE_URL}/signup`;
        const response = APIClient<SignupResponseType>(url, "POST", body);
        return response;
    }
    catch (error) {
        console.log(error, "Error in Signup API");
        throw (error);
    }
}

// The below API call is used to make a request to the backend to check if the user is logged in or not
// I will be making the below API call in useAuth which serve as the wrapper for all the auth related API calls
// This API call will be made in the App.tsx file
const getSessionAPI = async (): Promise<SessionResponseType> => {
    try {
        const data = await APIClient<SessionResponseType>(`${BASE_URL}/auth/getSessionDetail`, "GET", {});
        return data;
    } catch (error) {
        console.error('Error Occured while fetching session', error);
        throw (error);
    }
}


const refreshToken = async (): Promise<any> => {
    try {
        const data = await APIClient<any>(`${BASE_URL}/auth/refresh`, "GET", {});
        return data;
    } catch (error) {
        console.error('Error Occured while refreshing token', error);
        throw (error);
    }
}

const LogoutAPI = async (): Promise<any> => {
    try {
        const data = await APIClient<any>(`${BASE_URL}/auth/logout`, "POST", {});
        return data;
    } catch (error) {
        console.error('Error Occured while logging out', error);
        throw (error);
    }
}

export { LoginAPI, SignupAPI, getSessionAPI, refreshToken, LogoutAPI }