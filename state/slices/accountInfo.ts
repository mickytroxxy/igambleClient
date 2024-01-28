import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: any = null;

const accountSlice = createSlice({
  name: "accountSlice",
  initialState,
  reducers: {
    setAccountInfo: (state, action: PayloadAction<any>) => {
      return action.payload;
    }
  },
});

export const { setAccountInfo } = accountSlice.actions;
export default accountSlice.reducer;
