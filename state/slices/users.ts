import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserProfile } from "../../constants/Types";

const initialState: { users: UserProfile[]; activeUser:UserProfile} = {
    users: [],
    activeUser: {}
};

const usersSlice = createSlice({
  name: "usersSlice",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<UserProfile[]>) => {
        state.users = action.payload;
    },
    setActiveUser: (state, action: PayloadAction<UserProfile>) => {
        state.activeUser = action.payload;
    }
  },
});

export const { setActiveUser,setUsers } = usersSlice.actions;
export default usersSlice.reducer;
