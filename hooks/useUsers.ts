import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { getRequestData, getUserById, getUsers } from '../helpers/api';
import { setUsers } from '../state/slices/users';
import { UserProfile } from '../constants/Types';
import Constants from 'expo-constants';
import { setAccountInfo } from '../state/slices/accountInfo';
const useUsers = () => {
    const { location } = useSelector((state: RootState) => state.location);
    const accountInfo = useSelector((state: RootState) => state.accountInfo);
    const { activeUser,users } = useSelector((state: RootState) => state.users);
    const [usersError,setUsersError] = useState<any>(null);
    const profileOwner = accountInfo?.clientId === activeUser?.accountOwner;
    const [requestData,setRequestData] = useState([]);
    const dispatch = useDispatch();
    
    const getServiceProviders = async (latitude:number,longitude:number,range:number,isInit:boolean) => {
        try {
            const response : UserProfile[] = await getUsers(latitude,longitude,Constants.isDevice ? range : 30000);
            if(response.length > 0){
                dispatch(setUsers(response));
                setUsersError(null);
            }else{
                if(users.length > 0 && isInit){
                    
                }else{
                    setUsersError("No service providers found within the specified location")
                }
            }
        } catch (error) {
            console.error('Error retrieving local users:', error);
        }
    }
    const getRequest = async() => {
        try {
            const response:any = await getRequestData(accountInfo?.clientId,activeUser?.clientId || '');
            setRequestData(response);
        } catch (error) {
            setRequestData([]);
            console.log(error)
        }
    }
    const updateUser = async () => {
        try {
            const response = await getUserById(accountInfo?.clientId);
            if(response.length > 0){
                dispatch(setAccountInfo(response[0]))
            }
        } catch (error) {
            
        }
    }
    useEffect(() => {
        getServiceProviders(location.latitude,location.longitude,200,true);
        updateUser();
    },[])
    return {activeUser,users,usersError,location,profileOwner,accountInfo,requestData,getRequest,getServiceProviders};
};

export default useUsers;
