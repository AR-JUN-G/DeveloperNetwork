import { createSlice } from "@reduxjs/toolkit";

type UserState = {
    userID: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    profilePic: string | null;
}

// 2. Set the initial state using that interface
const initialState: UserState = {
    userID: null,
    firstName: null,
    lastName: null,
    email: null,
    profilePic: null,
};

const userSlice = createSlice({
    name: "Users",
    initialState,
    reducers: {
        updateUserDetails: (state, action) => {
            console.log(action.payload, "Payload")
            state.userID = action.payload.userID;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.email = action.payload.email;
            state.profilePic = action.payload.photourl;
        }
    }
})

export const { updateUserDetails } = userSlice.actions;
export default userSlice.reducer;