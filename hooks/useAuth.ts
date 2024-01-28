import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { phoneNoValidation, sendSms, showToast } from '../helpers/methods';
import { createData, getGeoPoint, getUserDetailsByPhone, loginApi, updateUser } from '../helpers/api';
import { setAccountInfo } from '../state/slices/accountInfo';
import { setConfirmDialog } from '../state/slices/ConfirmDialog';
import { useRouter } from 'expo-router';
import { LocationType, UserProfile } from '../constants/Types';
import { setActiveUser } from '../state/slices/users';

const about:string = 'Hello there I`m using MJOLO+, please follow me for more entertaining photos'
const birthDay = '01/01/2003';
const isVerified:boolean = false;
const address:LocationType = {text:'No address associated',latitude:0,longitude:0};
const avatar:string = '';
const photos:[] = [];
const balance = 0;
const rates:[] = [];
const transactions:[] = [];
const history:[] = [];
const deleted = false;

const useAuth = () => {
    const router = useRouter();
    const { countryData,locationWithText } = useSelector((state: RootState) => state.location);
    const accountInfo = useSelector((state: RootState) => state.accountInfo);
    const [confirmationCode, setConfirmationCode] = useState<number | string>(0);
    const dispatch = useDispatch();
    const [formData,setFormData] = useState({phoneNumber:'',password:'',fname:'',gender:'MALE'});
    const handleChange = (field:string,value:string) => setFormData(v =>({...v, [field] : value}));

    const login = async() =>{
        if(formData.phoneNumber.length > 7){
            if(formData.password.length > 5){
                const phoneNumber = phoneNoValidation(formData.phoneNumber,countryData.dialCode);
                if(phoneNumber){
                    const response = await loginApi(phoneNumber,formData.password);
                    if(response.length > 0){
                        dispatch(setAccountInfo(response[0]))
                        router.push("Home")
                    }else{
                        showToast("Invalid login details")
                    }
                }
            }else{
                showToast("Your password should be at least 6 characters long!")
            }
        }else{
            showToast("Your phone number is not valid!");
        }
    }
    const logOut = () => {
        dispatch(setConfirmDialog({isVisible:true,text:`Hi ${accountInfo.fname}, You are about t sign out, your phonenumber and password will be required to sign in again!`,okayBtn:'Cancel',severity:true,cancelBtn:'LOG_OUT',response:(res:boolean) => { 
            if(!res){
                router.push("SplashScreen")
                dispatch(setAccountInfo(null));
            }
        }}))
    }
    const register = async() => {
        if(formData.fname !== '' && formData.password.length > 5 && formData.phoneNumber.length > 7){
            dispatch(setConfirmDialog({isVisible:true,text:`Hi ${formData.fname}, please confirm if you have entered the correct details`,okayBtn:'CONFIRM',cancelBtn:'Cancel',response:(res:boolean) => { 
                const phoneNumber = phoneNoValidation(formData.phoneNumber,countryData.dialCode);
                if(phoneNumber){
                    if(res){
                        const code = Math.floor(Math.random()*89999+10000);
                        const obj = {...formData,date:Date.now(),phoneNumber,code}
                        router.push({pathname:'ConfirmScreen',params:obj});
                        sendSms(phoneNumber,`Hi ${formData.fname}, your MJOLO GAME confirmation code is ${code}`)
                    }
                }else{
                    showToast("Invalid phonenumber")
                }
            }}))
        }else{
            showToast('Please carefully fill in to proceed!')
        }
    }

    const confirmCode = async (obj:UserProfile) => {
        if (confirmationCode.toString() === (obj.code || "").toString() || null) {
            const phoneNumber = obj.phoneNumber;
            const clientId:string = obj.fname?.toUpperCase().slice(0, 2) + Math.floor(Math.random() * 89999999 + 10000009).toString();
            const accountOwner:string = clientId;
            const geoHash = getGeoPoint(locationWithText.latitude,locationWithText.longitude);
            const newObj:UserProfile = { ...obj, clientId,avatar,birthDay,services:[],photos,about,accountOwner,isVerified,deleted,address:(locationWithText || address),geoHash, balance, history, transactions, rates };
        
            const response = await getUserDetailsByPhone(phoneNumber || "");
            
            if (response.length === 0) {
                const res = await createData("users", clientId, newObj);
                if(res){
                    dispatch(setAccountInfo(newObj));
                    router.push("Home")
                }
            }else{
                const res = response[0];
                const updatedObj: UserProfile = { ...newObj, clientId: res.clientId };
                dispatch(setAccountInfo(updatedObj));
                router.push("Home");
                await updateUser("users", res.clientId.toString(), updatedObj);
            }
        } else {
          showToast("Invalid confirmation code!");
        }
    };
    const createServiceProviderAccount = async(obj:any,isSelf:boolean) => {
        const clientId:string = accountInfo.fname?.toUpperCase().slice(0, 2) + Math.floor(Math.random() * 89999999 + 10000009).toString();
        const accountOwner:string = accountInfo?.clientId;
        const geoHash = getGeoPoint(locationWithText.latitude,locationWithText.longitude);
        const account = {...obj,clientId,accountOwner,geoHash,password:'000000',avatar,photos,balance,rates,transactions,birthDay,about,isVerified,history,date:Date.now(),type:'SERVICE PROVIDER'};
        if(isSelf){
            const message = `Hello ${accountInfo.fname},\nThank you for choosing to create your service provider account with us. Before proceeding, we kindly request that you carefully review our terms and conditions, which can be found at https://lifestyle.empiredigitals.org.\nAs part of our service, please note that we collect a commission of 15% from your earnings. This commission helps us maintain and improve our platform, ensuring a seamless experience for both service providers and customers.\nIf you have any questions or concerns, please don't hesitate to reach out to our support team.\nWe appreciate your cooperation and look forward to working with you.\n\nBest regards,\nYour Service Provider Team`;
            dispatch(setConfirmDialog({isVisible:true,text:message,okayBtn:'CONFIRM',cancelBtn:'Cancel',response:async(res:boolean) => { 
                if(res){
                    const {services,privacy} = obj;
                    const updatedObj: UserProfile = {...accountInfo,services,privacy,type:'SERVICE PROVIDER'};
                    dispatch(setAccountInfo(updatedObj));
                    dispatch(setActiveUser(updatedObj));
                    await updateUser("users", accountInfo?.clientId, updatedObj);
                    showToast('Thank you, you are now a service provider!')
                    router.back();    
                }
            }}))
        }else{
            // const response = await createData("users", clientId, account);
            // if(response){
            //     showToast('Thank you, '+account.fname+' Is now a service provider!')
            //     router.back();
            // }
            showToast("You don't have the agent's permission at this moment!")
        }
    }
    return { countryData,accountInfo,logOut,createServiceProviderAccount,handleChange,login,formData,register,confirmCode,setConfirmationCode,confirmationCode};
};

export default useAuth;
