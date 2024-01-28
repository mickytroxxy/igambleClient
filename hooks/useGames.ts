import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { setBettingAmount, setCurrentToken, setGamblingItems, setGameStarted, setGameType, setItems, setPackages } from '../state/slices/game';
import { GamblingItemsType } from '../constants/Types';
import { showToast } from '../helpers/methods';
import { setModalState } from '../state/slices/modalState';
import useUpdates from './useUpdates';
import { createData, getMyGamblingItems, getMyWins, updateData } from '../helpers/api';
import { setActiveUser } from '../state/slices/users';
import { setConfirmDialog } from '../state/slices/ConfirmDialog';
import { useRouter } from 'expo-router';
export const defaultItems:GamblingItemsType[] = [
    { id: 1, class: 'VIP JACKPOT', duration: 1, totalCost: 0,minBet:1, selected: false, items: ["EDIT ME"], description: "Enter package description..." },
    { id: 2, class: 'FIRST CLASS', duration: 1, totalCost: 0,minBet:1, selected: false, items: ["EDIT ME"], description: "Enter package description..." },
    { id: 3, class: 'SECOND CLASS', duration: 1, totalCost: 0,minBet:1, selected: false, items: ["EDIT ME"], description: "Enter package description..." },
    { id: 4, class: 'THIRD CLASS', duration: 1, totalCost: 0,minBet:1, selected: false, items: ["EDIT ME"], description: "Enter package description..." },
    { id: 5, class: 'STARTER PACK', duration: 1, totalCost: 0,minBet:1, selected: false, items: ["EDIT ME"], description: "Enter package description..." },
];
const UNFORTUNATE_CLASS = "UNFORTUNATE"
const useGames = () => {
    const dispatch = useDispatch();
    const {handleChange} = useUpdates();
    const accountInfo = useSelector((state: RootState) => state.accountInfo);
    const router = useRouter();
    const {bettingAmount,mainBalance,gamblingItems,gameTypes,gameStarted, items, currentToken} = useSelector((state: RootState) => state.game);
    const currentAmount = currentToken?.currentAmount;
    const isGameOver = gamblingItems.filter(item => item?.selected)?.length > 0;
    const gameType = gameTypes.filter(item => item?.selected)[0];
    const getGamblingItems = () => {
        let possibleWins = items?.filter(item => (bettingAmount | 0) >= item.minBet);
        let losingItemsCount = 9 ;
        if((possibleWins.length === 1) || (possibleWins.length === 2)){
            losingItemsCount = losingItemsCount - 1;
        }
        if((possibleWins.length === 3) || (possibleWins.length === 4)){
            losingItemsCount = losingItemsCount - 2;
        }
        if(possibleWins.length === 5){
            losingItemsCount = losingItemsCount - 3;
        }
        const losingItems = Array.from({ length: losingItemsCount }, (_, index) => ({ id: index + 6, class: UNFORTUNATE_CLASS, selected: false }));
        const remainingItemsCount = 9 - losingItems.length;

        const remainingItems:any = [];
        while (remainingItems?.length < remainingItemsCount) {
            const randomIndex = Math.floor(Math.random() * possibleWins.length);
            const selectedItem = possibleWins[randomIndex];
            remainingItems.push(selectedItem);
            possibleWins.splice(randomIndex, 1);
            possibleWins.push({ id:Math.floor(Math.random() * 1000 + 10000), class: UNFORTUNATE_CLASS, selected: false,minBet:1 })
        }
        const randomizedItems = [...remainingItems, ...losingItems].sort(() => Math.random() - 0.5);
        dispatch(setGamblingItems(randomizedItems))
        return randomizedItems;
    };
    const getMyWonPackages = async(fn?:any) => {
        try {
            const response:GamblingItemsType[] = await getMyWins(accountInfo?.clientId, currentToken?.token)
            if(response.length > 0){
                dispatch(setPackages(response));
                fn && fn(response)
            }
        } catch (error) {
            console.log("Error while trying to get packages")
        }
    }
    const updateTokenBalance = async () => {
        const balance = currentAmount - bettingAmount;
        updateData("tokens",currentToken?.token,{field:'currentAmount',value:balance});
        dispatch(setCurrentToken({...currentToken,currentAmount:balance}))
    }
    const handleWinUpdates = async(selectedItem:GamblingItemsType,success:boolean) => {
        const transactionId:string = accountInfo.fname?.toUpperCase().slice(0, 2) + Math.floor(Math.random() * 89999999 + 10000009).toString();
        const date = Date.now();
        const obj = {...selectedItem,bettingAmount,transactionId,success,clientId:accountInfo?.clientId,date,status:0,token:currentToken.token};
        await createData("transactions",transactionId,{transactionId,token:currentToken.token,status:"PENDING",date,fromUser:accountInfo?.clientId,fromToArray:[accountInfo?.clientId],toUser:"",amount:bettingAmount,isCash:false,category:'BETTING',type:selectedItem.class,commission:0});
        await createData("bettings",transactionId,obj)
        if(selectedItem.class !== UNFORTUNATE_CLASS){
            dispatch(setModalState({isVisible:true,attr:{headerText:'WON PACKAGE',status:true,packages:[obj]}}));
        }
        updateTokenBalance();
        getGamblingItems();
        getMyWonPackages();
    }
    const handleShowPackages = () => {
        dispatch(setConfirmDialog({isVisible: true,text: `You can view available packages or the ones you have won`,okayBtn: 'WON',cancelBtn: 'AVAILABLE',response: (res:boolean) => {
            if (res) {
                getMyWonPackages((packages:any) => {
                    dispatch(setModalState({isVisible:true,attr:{headerText:'WON PACKAGE',status:true,packages}}));
                });
            }else{
                dispatch(setModalState({isVisible:true,attr:{headerText:'SHOW PACKAGES',status:false,packages:items}}))
            }
        }}));
    }
    const flipCard = (selectedItem: GamblingItemsType) => {
        if(currentAmount >= bettingAmount){
            if(gameStarted){
                if(!isGameOver || gameType.category !== "LUCKY CARD"){
                    if(gameType.category === "LUCKY CARD"){dispatch(setGamblingItems(gamblingItems.map((item:GamblingItemsType) => item.id === selectedItem.id ? {...item,selected:true} : item)))}
                    if(selectedItem.class === UNFORTUNATE_CLASS){
                        showToast("Unfortunately you didn't make it this time, please try again!");
                        handleWinUpdates(selectedItem,false);
                    }else{
                        showToast("Congratulations on your "+selectedItem.class+" win, You can claim this anytime...");
                        handleWinUpdates(selectedItem,true);
                    }
                }
    
            }else{
                showToast("Please start the game to proceed!")
            }
        }else{
            showToast("You have run out of funds!")
        }
    };
    const savePackage = async(packageInfo:GamblingItemsType) => {
        const newData = items.map(item => item.class === packageInfo.class ? {...packageInfo} : {...item});
        dispatch(setItems(newData));
        handleChange("gamblingItems",newData)
        showToast("Package saved");
        router.back();
    }
    const getItemsToGambleWith = async () => {
        const response = await getMyGamblingItems(accountInfo?.clientId);
        if(response){
            dispatch(setItems(response?.[0]?.gamblingItems ? response?.[0]?.gamblingItems : defaultItems))
        }else{
            dispatch(setItems(defaultItems))
        }
    }
    useEffect(() => {
        dispatch(setGameStarted(false))
        dispatch(setBettingAmount(0));
        dispatch(setActiveUser(accountInfo))
    },[])
    useEffect(() => {
        getItemsToGambleWith();
    },[])
    useEffect(() => {
        getGamblingItems();
    },[bettingAmount])
    return {bettingAmount,getMyWonPackages,savePackage,isGameOver,getGamblingItems,handleShowPackages,mainBalance,flipCard,gameTypes,gamblingItems,gameType,accountInfo,gameStarted,items,currentAmount};
};

export default useGames;
