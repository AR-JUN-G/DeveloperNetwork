import { APIClient } from "./APIClient";
import { BASE_URL } from "../utils/constants";
import { ProfileAPIResponseType, ProfileDataType, PresignedUrlResponseType } from "../Types/ProfileAPI.types";
import { APIResponseType } from "../Types/CommonAPIResponse.types";
import { AxiosError } from "axios";

const getProfileAPI = async (): Promise<APIResponseType<ProfileAPIResponseType>> => {
    try {
        const url = `${BASE_URL}/profile`;
        const { data, status } = await APIClient<ProfileAPIResponseType>(url, "GET", {});

        return { data, error: null, status };
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

        return { data, error: null, status };
    } catch (error) {
        const AxiosError = error as AxiosError<{ message: string }>;
        return {
            data: null,
            error: AxiosError.response?.data?.message || "Failed to update profile",
            status: AxiosError.response?.status || 500
        }
    }
}

const getPresignedUrlAPI = async (fileType: string, fileExtension: string): Promise<APIResponseType<PresignedUrlResponseType>> => {
    try {
        const url = `${BASE_URL}/upload-url`;
        const { data, status } = await APIClient<PresignedUrlResponseType>(url, "GET", {}, { fileType, fileExtension });

        return { data, error: null, status };
    } catch (error) {
        const AxiosError = error as AxiosError<{ message: string }>;
        return {
            data: null,
            error: AxiosError.response?.data?.message || "Failed to get upload URL",
            status: AxiosError.response?.status || 500
        }
    }
}

const uploadFileToS3API = async (uploadUrl: string, file: File): Promise<boolean> => {
    try {
        const response = await fetch(uploadUrl, {
            method: "PUT",
            body: file,
            headers: {
                "Content-Type": file.type
            }
        });

        return response.ok;
    } catch (error) {
        console.error("Direct S3 upload failed", error);
        return false;
    }
}

export { getProfileAPI, editProfileAPI, getPresignedUrlAPI, uploadFileToS3API };
