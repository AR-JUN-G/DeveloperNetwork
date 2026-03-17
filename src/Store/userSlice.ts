import { createSlice } from "@reduxjs/toolkit";

type UserState = {
    userID: string | null;
    name: string | null;
    email: string | null;
    profilePic: string | null;
}

// 2. Set the initial state using that interface
const initialState: UserState = {
    userID: null,
    name: null,
    email: null,
    profilePic: null,
};

const userSlice=createSlice({
    name:"Users",
initialState,
    reducers:{
        updateUserDetails:(state,action)=>{
            state.userID=action.payload.userID;
            state.name=action.payload.name;
            state.email=action.payload.email;
            state.profilePic=action.payload.photourl;
        }
    }
})

export const {updateUserDetails}=userSlice.actions;
export default userSlice.reducer;