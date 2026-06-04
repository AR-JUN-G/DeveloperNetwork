import { APIClient } from "./APIClient";
import { BASE_URL } from "../utils/constants";
import { RequestOTPType, RequestOTPResponseType, VerifyOTPType, VerifyOTPResponseType } from "../Types/OTPLoginAPI.types";
import { APIResponseType } from "../Types/CommonAPIResponse.types";
import { AxiosError } from "axios";

const requestOTPAPI = async (body: RequestOTPType): Promise<APIResponseType<RequestOTPResponseType>> => {
    try {
        const url = `${BASE_URL}/auth/request-otp`;
        const { data, status } = await APIClient<RequestOTPResponseType>(url, "POST", { emailId: body.emailId });

        return {
            data: data,
            error: null,
            status: status
        };
    }
    catch (error) {
        const AxiosError = error as AxiosError<{ message: string }>;
        console.error("Error in requestOTPAPI", AxiosError);
        return {
            data: null,
            error: AxiosError.response?.data?.message || "Failed to send OTP",
            status: AxiosError.response?.status || 500
        };
    }
};

const verifyOTPAPI = async (body: VerifyOTPType): Promise<APIResponseType<VerifyOTPResponseType>> => {
    try {
        const url = `${BASE_URL}/auth/verify-otp`;
        const { data, status } = await APIClient<VerifyOTPResponseType>(url, "POST", { emailId: body.emailId, otp: body.otp });

        return {
            data: data,
            error: null,
            status: status
        };
    }
    catch (error) {
        const AxiosError = error as AxiosError<{ message: string }>;
        console.error("Error in verifyOTPAPI", AxiosError);
        return {
            data: null,
            error: AxiosError.response?.data?.message || "Invalid or expired OTP",
            status: AxiosError.response?.status || 500
        };
    }
};

export { requestOTPAPI, verifyOTPAPI };
