export type ProfileDataType = {
    _id: string;
    firstName: string;
    lastName: string;
    emailId: string;
    photourl?: string;
    age?: number;
    gender?: string;
    about?: string;
    skills?: string[];
}

export type ProfileAPIResponseType = {
    message: string;
    data: ProfileDataType;
}

export type PresignedUrlResponseType = {
    uploadUrl: string;
    publicUrl: string;
}
