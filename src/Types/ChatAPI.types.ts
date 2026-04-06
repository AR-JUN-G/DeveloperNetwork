type directChatResponseType = {
    userID: string;
    firstName: string;
    lastName: string;
    photourl: string;
    latestMessage: string;
    time: Date;
}

type directChatListResponseType = {
    message: string,
    chats: directChatResponseType[];
}

type availableMemberResponseType = {
    _id: string,
    firstName: string,
    lastName: string,
    photourl: string
}

type availableMembersForChatResponseType = {
    message: string,
    members: availableMemberResponseType[];
}

type directMessageReponseType = {
    _id: string,
    senderId: string,
    message: string,
    createdAt: Date
}

type directMessageListResponseType = {
    messages: directMessageReponseType[],
    pagination: {
        currentPage: number,
        hasMore: boolean
    }
}

export type { directChatResponseType, directChatListResponseType, availableMembersForChatResponseType, directMessageListResponseType, directMessageReponseType, availableMemberResponseType };