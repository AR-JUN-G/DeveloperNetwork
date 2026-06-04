export type RequestOTPType = {
    emailId: string;
};

export type RequestOTPResponseType = {
    message: string;
};

export type VerifyOTPType = {
    emailId: string;
    otp: string;
};

export type VerifyOTPResponseType = {
    message: string;
    userID: string;
    firstName: string;
    lastName: string;
    email: string;
    photourl: string;
};
