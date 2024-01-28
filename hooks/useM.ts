import { useCallback, useEffect, useState } from 'react';
import { createData, getAllMessages, getMessagesData, getUserById } from '../helpers/api';
import useUsers from './useUsers';
import { GiftedChat } from 'react-native-gifted-chat';
import useRequests from './useRequests';
import { sendPushNotification, showToast } from '../helpers/methods';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { setAllStoreMessages } from '../state/slices/messages';

const phoneNoRegex = /(?:[-+() ]*\d){5,13}/gm;
const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
const numInLetters = ["zero", "two", "three", "four", "five", "six", "seven", "eight"];

const useM = () => {
    const { activeUser, accountInfo, profileOwner } = useUsers();
    const dispatch = useDispatch();
    
    const { lastRequest } = useRequests();
    const [messages, setMessages] = useState<any[]>([]);
    const { allStoreMessages } = useSelector((state: RootState) => state.messages);
    const [allMessages, setAllMessages] = useState<any[]>([]);
    const unSeenMessages = allMessages?.filter(item => item.status === 0 && item.toUser === accountInfo?.clientId);

    const appendMessages = useCallback((newMessages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    }, []);

    useEffect(() => {
        if (allStoreMessages?.length > 0) {
            setAllMessages(allStoreMessages);
        }
    }, [allStoreMessages]);
    const appendAllMessages = useCallback(async (messages = []) => {
        const mergedMessages = [...allStoreMessages, ...messages];

        const uniqueUsers: any = {};
        const lastMessages: any = [];

        mergedMessages.forEach((item: any) => {
            const user = item.fromUser === accountInfo?.clientId ? item.toUser : item.fromUser;
            if (!uniqueUsers[user] || item.createdAt > uniqueUsers[user].createdAt) {
                uniqueUsers[user] = item;
            }
        });

        const promises: Promise<void>[] = [];

        for (const user in uniqueUsers) {
            promises.push(getUserData(user));
        }

        async function getUserData(user:any): Promise<void> {
            const userDetails = await getUserById(user);
            lastMessages.push({ ...uniqueUsers[user], userDetails: userDetails?.[0] });
        }

        Promise.all(promises).then(() => {
            dispatch(setAllStoreMessages(lastMessages));
        });

    }, [allMessages, dispatch]);

    const onSend = async(message:any) => {
        const {text,_id} = message[0];
        const createdAt = new Date();
        const fromUser = accountInfo?.clientId;
        const toUser = activeUser?.clientId;
        const fromToArray = [fromUser,toUser];
        const connectionId = fromUser+toUser;
        const status = 0;
        if((messages.length < 8) || lastRequest?.status === "INTERESTED"){
            if((text.match(phoneNoRegex) === null && text.match(emailRegex) === null && (!numInLetters.some(v => text.toLowerCase().includes(v))))){
                const obj = {_id,text,createdAt,status,fromUser,toUser,fromToArray,connectionId,user:{_id:fromUser,}};
                await createData("chats",_id,obj);
                const {services,photos,...rest} = accountInfo;
                sendPushNotification(activeUser?.notificationToken,accountInfo?.fname,text,rest);
            }else{
                showToast("You are not allowed to share contact info")
            }
        }else{
            showToast("You are limited to sending only seven (7) free messages until you place a request.")
        }
    }

    useEffect(() => {
        getMessagesData(accountInfo?.clientId, activeUser?.clientId || '', appendMessages);
        getAllMessages(accountInfo?.clientId, appendAllMessages);
    }, []);

    return {activeUser,profileOwner,accountInfo,messages,setMessages,onSend,allMessages,unSeenMessages};
};

export default useM;