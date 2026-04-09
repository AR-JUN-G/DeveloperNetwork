type ReceivedRequestType = {
    _id: string,
    fromUserID: {
        _id: string,
        firstName: string,
        lastName: string,
        photourl: string
    },
    status: string
}

type ReceivedRequestsListResponseType = {
    message: string,
    requests: ReceivedRequestType[]
}

type FeedUserType = {
    _id: string,
    firstName: string,
    lastName: string,
    photourl?: string,
    about?: string,
    skills?: string[],
    age?: number,
    gender?: string
}

type FeedListResponseType = {
    message: string,
    data: FeedUserType[]
}

type ActionResponseType = {
    message: string
}

export type {
    ReceivedRequestType, 
    ReceivedRequestsListResponseType, 
    FeedUserType, 
    FeedListResponseType,
    ActionResponseType
};