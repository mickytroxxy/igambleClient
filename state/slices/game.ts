import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GamblingItemsType } from "../../constants/Types";
import { TokenTypes } from "../../components/profile/BodySection";

const initialState: { bettingAmount: number;packages:GamblingItemsType[]; gameStarted:boolean; mainBalance:any; gamblingItems:GamblingItemsType[]; gameTypes:any[],items:GamblingItemsType[], currentToken:TokenTypes} = {
    bettingAmount: 450,
    mainBalance: 30000,
    gamblingItems:[],
    packages:[],
    gameStarted:false,
    items:[],
    currentToken:{
        accountId:'',
        currentAmount: 0,
        purchaseValue:0,
        token: '',
        timeStamp:0,
    },
    gameTypes:[{category:'LUCKY CARD',selected:true},{category:'WHEEL OF FORTUNE',selected:false}]
};

const gameSlice = createSlice({
  name: "gameSlice",
  initialState,
  reducers: {
    setBettingAmount: (state, action: PayloadAction<number>) => {
        state.bettingAmount = action.payload;
    },
    setMainBalance: (state, action: PayloadAction<number>) => {
        state.mainBalance = action.payload;
    },
    setGamblingItems: (state, action: PayloadAction<any[]>) => {
        state.gamblingItems = action.payload;
    },
    setGameType: (state, action: PayloadAction<any[]>) => {
        state.gameTypes = action.payload;
    },
    setGameStarted: (state, action: PayloadAction<boolean>) => {
        state.gameStarted = action.payload;
    },
    setPackages: (state, action: PayloadAction<GamblingItemsType[]>) => {
        state.packages = action.payload;
    },
    setItems: (state, action: PayloadAction<GamblingItemsType[]>) => {
        state.items = action.payload;
    },
    setCurrentToken: (state, action: PayloadAction<TokenTypes>) => {
        state.currentToken = action.payload;
    }
  },
});

export const { setBettingAmount,setItems,setCurrentToken,setGameStarted,setPackages,setMainBalance,setGamblingItems,setGameType } = gameSlice.actions;
export default gameSlice.reducer;
