import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { Platform } from 'react-native';
import { setModalState } from '../state/slices/modalState';
import { useRouter } from 'expo-router';
import { WithDrawalType } from '../constants/Types';
import { currencyFormatter, showToast } from '../helpers/methods';
import { createData } from '../helpers/api';
import { setConfirmDialog } from '../state/slices/ConfirmDialog';
import useUpdates from './useUpdates';

let return_url:string,cancel_url:string;
const mechantId = 15759218;
const usePayment = () => {
    const accountInfo = useSelector((state: RootState) => state.accountInfo);
    const router = useRouter();
    const {handleChange} = useUpdates();
    const dispatch = useDispatch();

    const openBrowser = (field:string,amount:number) => {
        router.push({pathname:'WebBrowser',params:{amount}});
    }
    const handleWithdrawal = (data:WithDrawalType) => {
        if(data.amount <= accountInfo.balance){
            const transactionId:string = accountInfo.fname?.toUpperCase().slice(0, 2) + Math.floor(Math.random() * 89999999 + 10000009).toString();
            const date = Date.now();
            const obj = {...data,date,clientId:accountInfo?.clientId,transactionId}
            dispatch(setConfirmDialog({isVisible: true,text: `Are you sure you want to place a withdrawal request of ${currencyFormatter(data.amount)} to ${data.accountNumber} - ${data.bankName}?\nPlease note that your funds may reflect in 72hrs.\n\nKind Regards.`,okayBtn: 'CONFIRM',cancelBtn: 'Cancel',severity: true,response: async(res:boolean) => {
                if (res) {
                    await createData("transactions",transactionId,{transactionId,status:"PENDING",date,fromUser:accountInfo?.clientId,fromToArray:[accountInfo?.clientId],toUser:"",amount:data.amount,isCash:false,category:'WITHDRAWAL',type:"WITHDRAWAL",commission:0});
                    await createData("withdrawals",transactionId,obj);
                    handleChange("balance",(accountInfo.balance - data.amount))
                    dispatch(setModalState({isVisible:true,attr:{headerText:'SUCCESS STATUS',message:'You have successfully placed your withdrawal request of '+currencyFormatter(data.amount)+' request. ',status:true}}));
                }
            }}));
        }else{
            showToast("The amount entered is greater than your balance!")
        }
    }
    const showAmountModal = () => {
        dispatch(setModalState({isVisible:true,attr:{headerText:'ENTER AMOUNT',isNumeric:true,field:'amount',placeholder:'How much would you like to load your account with?',handleChange:openBrowser}}))
    }
    const showWithdrawalModal = () => {
        dispatch(setModalState({isVisible:true,attr:{headerText:'WITHDRAW FUNDS',handleChange:(formData:any) => {
            handleWithdrawal(formData);
        }}}))
    }
    useEffect(() => {
        
    },[])
    return {showAmountModal,showWithdrawalModal};
};

export default usePayment;
