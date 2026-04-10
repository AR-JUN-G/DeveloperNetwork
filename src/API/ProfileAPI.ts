import { APIClient } from "./APIClient";
import { BASE_URL } from "../utils/constants";
import { ProfileAPIResponseType, ProfileDataType } from "../Types/ProfileAPI.types";
import { APIResponseType } from "../Types/CommonAPIResponse.types";
import { AxiosError } from "axios";

const getProfileAPI = async (): Promise<APIResponseType<ProfileAPIResponseType>> => {
    try {
        const url = `${BASE_URL}/profile`;
        const { data, status } = await APIClient<ProfileAPIResponseType>(url, "GET", {});

        return {
            data: data,
            error: null,
            status: status
        }
    } catch (error) {
        const AxiosError = error as AxiosError<{ message: string }>;
        return {
            data: null,
            error: AxiosError.response?.data?.message || "Failed to fetch profile",
            status: AxiosError.response?.status || 500
        }
    }
}

const editProfileAPI = async (profileData: Partial<ProfileDataType>): Promise<APIResponseType<ProfileAPIResponseType>> => {
    try {
        const url = `${BASE_URL}/profile`;
        const { data, status } = await APIClient<ProfileAPIResponseType>(url, "PATCH", profileData);

        return {
            data: data,
            error: null,
            status: status
        }
    } catch (error) {
        const AxiosError = error as AxiosError<{ message: string }>;
        return {
            data: null,
            error: AxiosError.response?.data?.message || "Failed to update profile",
            status: AxiosError.response?.status || 500
        }
    }
}

export { getProfileAPI, editProfileAPI };
