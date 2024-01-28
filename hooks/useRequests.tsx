import { useEffect, useState } from 'react';
import { createData, deleteData, getRequestData, updateData, updateUser } from '../helpers/api';
import useUsers from './useUsers';
import { showToast } from '../helpers/methods';
import { RequestType } from '../constants/Types';
import useMessages from './useMessages';

const useRequests = () => {
    const {activeUser,accountInfo,profileOwner} = useUsers();
    const [requestData,setRequestData] = useState<RequestType[]>([]);
    const lastRequest = requestData[requestData.length - 1];
    //const {onSend} = useMessages();
    const getRequest = async() => {
        try {
            const response:any = await getRequestData(accountInfo?.clientId,activeUser?.clientId || '',setRequestData);
            setRequestData(response);
        } catch (error) {
            setRequestData([]);
            console.log(error)
        }
    }
    const handleArriveRequest = async(connectionId:string) => {
        try {
            const response = await updateData('requests',connectionId,{value:'COMPLETED',field:'status'});
            await updateData('transactions',connectionId,{value:'COMPLETED',field:'status'});
            if(response){
                showToast("The request has been marked as successfully. Thank you for using MJOLO+");
                setRequestData([]);
                const _id:string = accountInfo.fname?.toUpperCase().slice(0, 2) + Math.floor(Math.random() * 8999999999 + 10000009999).toString();
                //onSend([{text:"Your request has been marked as completed",_id}]);
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleCancelRequest = async(connectionId:string,isAccepted?:boolean) => {
        try {
            const response = await deleteData('requests',connectionId);
            if(response){
                showToast("The request has been terminated successfully");
                setRequestData([]);
                const _id:string = accountInfo.fname?.toUpperCase().slice(0, 2) + Math.floor(Math.random() * 8999999999 + 10000009999).toString();
                //onSend([{text:"Your request has been terminated or rejected",_id}]);
                if(isAccepted){
                    await deleteData('transactions',connectionId);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleAcceptRequest = async(connectionId:string,offer:string,isCash:boolean,type:string) => {
        const commission = 0.15 * parseFloat(offer);
        const takeHomeAmount = parseFloat(offer) - commission;
        const receiverCurrentBalance = parseFloat((accountInfo?.balance || 0).toString());
        const senderCurrentBalance = parseFloat((activeUser?.balance || 0).toString());
        const receiverNewBalance = isCash ? receiverCurrentBalance - commission : receiverCurrentBalance + takeHomeAmount;
        const senderNewBalance = isCash ? senderCurrentBalance : senderCurrentBalance - parseFloat(offer);

        const owingDate = receiverNewBalance < 0 ? Date.now() : 'NOT_OWING'; 
        await updateUser("users",(accountInfo?.clientId || ''),{...accountInfo,balance:receiverNewBalance,owingDate});
        await updateData("users",(activeUser?.clientId || ''),{field:'balance',value:senderNewBalance});
        await createData("transactions",connectionId,{transactionId:connectionId,status:"PENDING",date:Date.now(),fromUser:activeUser?.clientId,fromToArray:[activeUser?.clientId,accountInfo?.clientId],toUser:accountInfo?.clientId,amount:offer,isCash,category:'REQUEST',type,commission});
        const updateRequestResponse = await updateData("requests",connectionId,{field:'status',value:'ACCEPTED'});
        if(updateRequestResponse){
            setRequestData([{...(lastRequest || {}), status: "ACCEPTED"}]);
            showToast("You have successfully accepted the request, now prepare to meet with your client!")
        }
    }
    useEffect(() => {
        getRequest();
    },[])
    return {activeUser,lastRequest,profileOwner,accountInfo,requestData,handleCancelRequest,handleArriveRequest,handleAcceptRequest};
};

export default useRequests;
