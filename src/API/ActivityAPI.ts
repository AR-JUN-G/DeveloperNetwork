/*
    The below code contain the API calls for the Activity component
    1. Get all the received Request
    2. Accept or Reject the Request
    3. Get Suggestion Requests(Feed)
    4. Send Request to the User
*/

import { 
    ReceivedRequestsListResponseType,
    FeedListResponseType,
    ActionResponseType
} from "../Types/ActivityAPI.types";
import { APIResponseType } from "../Types/CommonAPIResponse.types";
import { BASE_URL } from "../utils/constants";
import { APIClient } from "./APIClient";
import { AxiosError } from "axios";


// /api/users/request/received

const getAllReceivedRequests = async (): Promise<APIResponseType<ReceivedRequestsListResponseType>> => {
    try {
        const url = `${BASE_URL}/users/request/received`;
        const { data, status } = await APIClient<ReceivedRequestsListResponseType>(url, "GET", {});

        return {
            data: data,
            error: null,
            status: status
        }
    } catch (error) {
        const AxiosError = error as AxiosError<{ message: string }>;
        return {
            data: null,
            error: AxiosError.response?.data?.message || "Something went wrong",
            status: AxiosError.response?.status || 500
        }
    }
}

const reviewReceivedRequest = async (status: "accepted" | "rejected", requestId: string): Promise<APIResponseType<ActionResponseType>> => {
    try {
        const url = `${BASE_URL}/review/${status}/${requestId}`;
        const { data, status: resStatus } = await APIClient<ActionResponseType>(url, "POST", {});

        return { data, error: null, status: resStatus };
    } catch (error) {
        const AxiosError = error as AxiosError<{ message: string }>;
        return {
            data: null,
            error: AxiosError.response?.data?.message || "Review failed",
            status: AxiosError.response?.status || 500
        }
    }
}

const getFeed = async (): Promise<APIResponseType<FeedListResponseType>> => {
    try {
        const url = `${BASE_URL}/feed`;
        const { data, status } = await APIClient<FeedListResponseType>(url, "GET", {});

        return { data, error: null, status };
    } catch (error) {
        const AxiosError = error as AxiosError<{ message: string }>;
        return {
            data: null,
            error: AxiosError.response?.data?.message || "Feed fetch failed",
            status: AxiosError.response?.status || 500
        }
    }
}

const sendConnectionRequest = async (status: "interested" | "ignored", toUserID: string): Promise<APIResponseType<ActionResponseType>> => {
    try {
        const url = `${BASE_URL}/send/${status}/${toUserID}`;
        const { data, status: resStatus } = await APIClient<ActionResponseType>(url, "POST", {});

        return { data, error: null, status: resStatus };
    } catch (error) {
        const AxiosError = error as AxiosError<{ message: string }>;
        return {
            data: null,
            error: AxiosError.response?.data?.message || "Request failed",
            status: AxiosError.response?.status || 500
        }
    }
}

export {
    getAllReceivedRequests,
    reviewReceivedRequest,
    getFeed,
    sendConnectionRequest
};