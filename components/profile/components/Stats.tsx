import React, { memo } from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Ionicons,Feather } from "@expo/vector-icons";
import { UserProfile } from '../../../constants/Types';
import { useRouter } from 'expo-router';
import { setModalState } from '../../../state/slices/modalState';
import { useDispatch } from 'react-redux';
import useUsers from '../../../hooks/useUsers';
import useMessages from '../../../hooks/useMessages';
import { sendPushNotification, showToast } from '../../../helpers/methods';
import { updateData } from '../../../helpers/api';
import { setActiveUser } from '../../../state/slices/users';
interface Props {
    data?: {
      profileOwner?: boolean;
      activeProfile?: UserProfile;
    };
}
const Stats: React.FC<Props> = memo((props) => {
    const { profileOwner, activeProfile} = props.data || {};
    const {users,accountInfo} = useUsers();
    const {onSend} = useMessages();
    const dispatch = useDispatch();
    const navigation = useRouter();
    let iRated = activeProfile?.rates?.filter(user => user === accountInfo?.clientId).length;
    const handleFollowers = () => {
        if(accountInfo){
            let currentFollowers:any = [...activeProfile?.rates||[]];
            if(iRated === 0){
                currentFollowers = [...currentFollowers,accountInfo?.clientId];
            }else{
                currentFollowers.splice(currentFollowers.indexOf(accountInfo?.clientId), 1)
            }
            dispatch(setActiveUser({...activeProfile,rates:currentFollowers}))
            updateData("users",(activeProfile?.clientId || ''),{value:currentFollowers,field:"rates"})
            const {services,photos,...rest} = accountInfo;
            sendPushNotification(activeProfile?.notificationToken,accountInfo?.fname,'You have gained a new follower, keep it up!',rest);
        }
    }
    if(profileOwner){
        return (
            <View style={styles.statsContainer}>
                <View style={styles.statsBox}>
                    <TouchableOpacity onPress={() => dispatch(setModalState({isVisible:true,attr:{headerText:'BROADCAST MESSAGE',hint:'What would you like to say to nearby users?',field:'broadCast',placeholder:'Enter your message',handleChange:(field:string,value:string)=>{
                        users.map((user:UserProfile) => {
                            if(user.notificationToken && user.clientId !== accountInfo?.clientId){
                                const _id:string = accountInfo.fname?.toUpperCase().slice(0, 2) + Math.floor(Math.random() * 8999999999 + 10000009999).toString();
                                onSend([{text:value,_id}]);
                            }
                        });
                        showToast("Your message is being broadcasted...")
                    }}}))} style={{justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#0e75b3" alignSelf="center"></Ionicons>
                        <Text style={{fontFamily:'fontLight',color:'#0e75b3'}}>Broadcast</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.statsBox, { borderColor: "#e1ece7", borderLeftWidth: 0.5, borderRightWidth: 0.5 }]}>
                    <TouchableOpacity style={{alignItems:'center',alignContent:'center'}} onPress={() => {navigation.push("Balance")}}>
                        <Text style={[{ fontSize: 18,fontFamily:'fontBold' }]}>R {activeProfile?.balance?.toFixed(2)}</Text>
                        <Text style={{fontFamily:'fontLight',color:'#0e75b3'}}>Balance</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.statsBox}>
                    {(activeProfile?.photos?.length || 0 > 0) ? (
                        <TouchableOpacity style={{justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                            <Feather name="user-check" size={24} color="#0e75b3" alignSelf="center"></Feather>
                            <Text style={{fontFamily:'fontLight',color:'#0e75b3'}}>Followers ({activeProfile?.rates?.length})</Text>
                        </TouchableOpacity>
                    ):(
                        <TouchableOpacity style={{justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                            <Ionicons name="camera-outline" size={24} color="#5586cc" alignSelf="center"></Ionicons>
                            <Text style={{fontFamily:'fontLight',color:'#0e75b3'}}>Add Photos</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        )
    }else{
        return(
            <View style={styles.statsContainer}>
                <View style={styles.statsBox}>
                    <Text style={{fontFamily:'fontBold',color:'#757575'}}>{activeProfile?.rates?.length}</Text>
                    <Text style={{fontFamily:'fontLight',color:'#0e75b3'}}>Followers</Text>
                </View>
                <View style={[styles.statsBox, { borderColor: "#e1ece7", borderLeftWidth: 0.5, borderRightWidth: 0.5 }]}>
                    <TouchableOpacity onPress={() => navigation.push("ChatScreen")}>
                        <Ionicons name="chatbubble-ellipses-outline" size={36} color="#0e75b3" alignSelf="center"></Ionicons>
                    </TouchableOpacity>
                </View>
                <View style={styles.statsBox}>
                    <TouchableOpacity onPress={handleFollowers}>
                        {((iRated || 0) > 0) ? (
                            <Feather name="user-check" size={32} color="#0e75b3" alignSelf="center"></Feather>
                        ):(
                            <Ionicons name="person-add-outline" size={30} color="gray" alignSelf="center"></Ionicons>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
})
const styles = StyleSheet.create({
    statsContainer: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: -5,
        padding:5,
    },
    statsBox: {
        alignItems: "center",
        flex: 1
    },
});
export default Stats