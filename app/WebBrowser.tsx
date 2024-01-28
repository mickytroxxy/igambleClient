import { useRouter, useSearchParams } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import { WebView } from 'react-native-webview';
import { useDispatch } from "react-redux";
import { setModalState } from "../state/slices/modalState";
import { currencyFormatter, showToast } from "../helpers/methods";
import { createData, updateData } from "../helpers/api";
import useUsers from "../hooks/useUsers";
import { setAccountInfo } from "../state/slices/accountInfo";
import { setActiveUser } from "../state/slices/users";
const mechantId = 15759218;
const WebBrowser = () =>{
    const dispatch = useDispatch();
    const router = useRouter();
    const { amount } = useSearchParams();
    const {accountInfo,activeUser} = useUsers();
    const return_url = Platform.OS === "android" ? encodeURIComponent('https://lifestyle.empiredigitals.org/') : 'https://lifestyle.empiredigitals.org/';
    const cancel_url = Platform.OS === "android" ? encodeURIComponent('https://smartstore.empiredigitals.org/') : 'https://smartstore.empiredigitals.org/';
    const baseUrl = "https://www.payfast.co.za/eng/process?cmd=_paynow&receiver="+mechantId+"&item_name=uberflirt credit purchase&item_description=uberFlirt credit purchase&amount="+amount+"&return_url="+return_url+"&cancel_url="+cancel_url+""
    const webViewSource: any = baseUrl ? { uri: baseUrl } : { uri: "" };


    const loadAccount = async() => {
        const balance = accountInfo?.balance + parseFloat((amount || 0).toString());
        await updateData("users",accountInfo?.clientId,{value:balance,field:'balance'});
        const connectionId:string = 'LDA' + Math.floor(Math.random() * 89999999 + 10000009).toString();
        await createData("transactions",connectionId,{transactionId:connectionId,status:"COMPLETED",date:Date.now(),fromUser:accountInfo?.clientId,fromToArray:[accountInfo?.clientId],toUser:accountInfo?.clientId,amount,isCash:false,category:'LOAD ACCOUNT',type:'LOAD ACCOUNT',commission:0});
        showToast("Amount successfully loaded!");
        dispatch(setAccountInfo({...accountInfo,balance}));
        if(accountInfo?.clientId === activeUser?.clientId){
            dispatch(setActiveUser({...accountInfo,balance}))
        }
    }
    return(
        <View style={{flex:1}}>
            <WebView
                source={webViewSource}
                showsVerticalScrollIndicator={false}
                onLoadStart={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    if (!nativeEvent.url.includes("https://www.payfast.co.za/eng/process?cmd=_paynow&receiver=")) {
                        if (nativeEvent.url.includes("smartstore")) {
                            dispatch(setModalState({isVisible:true,attr:{headerText:'SUCCESS STATUS',message:'Your transaction did not went well, please make sure your card is valid and has sufficient funds',status:false}}))
                            router.back();
                        }else if (nativeEvent.url.includes("lifestyle") && (!nativeEvent.url.includes("www.payfast.co.za"))) {
                            dispatch(setModalState({isVisible:true,attr:{headerText:'SUCCESS STATUS',message:'You have successfully loaded your account with '+currencyFormatter(amount+'. Happy hunting...'),status:true}}));
                            router.back();
                            loadAccount();
                        }
                    }
                }}
            />
        </View>
    )
}
export default WebBrowser;