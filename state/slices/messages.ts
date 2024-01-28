import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: { storeMessages: any[]; allStoreMessages:any} = {
  storeMessages: [],
  allStoreMessages: []
};

const messageSlice = createSlice({
  name: "messageSlice",
  initialState,
  reducers: {
    setStoreMessages: (state, action: PayloadAction<any[]>) => {
      state.storeMessages = action.payload;
    },
    setAllStoreMessages: (state, action: PayloadAction<any[]>) => {
      state.allStoreMessages = action.payload;
    }
  },
});

export const { setStoreMessages,setAllStoreMessages } = messageSlice.actions;
export default messageSlice.reducer;
