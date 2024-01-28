import { View, TouchableOpacity, Text, Image, ScrollView } from "react-native"
import { GiftedChat,Bubble,Send,InputToolbar,Day } from 'react-native-gifted-chat'

import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Icon from "../components/ui/Icon";
import useUsers from "../hooks/useUsers";
import useMessages from "../hooks/useMessages";
import { Stack, useRouter } from "expo-router";
import { colors } from "../constants/Colors";
import { useDispatch } from "react-redux";
import { setActiveUser } from "../state/slices/users";
import { useEffect } from "react";
import { UserProfile } from "../constants/Types";
import moment from "moment";
import { updateData } from "../helpers/api";
import { StatusBar } from "expo-status-bar";

const MessageList = () => {
    const {allMessages} = useMessages();
    const {accountInfo,activeUser} = useUsers();
    const dispatch = useDispatch();
    const router = useRouter();
    
    const handleMessageClicked = (userDetails:UserProfile,message:any) => {
        dispatch(setActiveUser(userDetails));
        router.push("ChatScreen");
        if(message.status === 0 && message.fromUser !== accountInfo?.clientId){
            updateData("chats",message._id,{value:1,field:'status'})
        }
    }
    return(
        <Animatable.View animation="fadeInUpBig" duration={500} useNativeDriver={true} style={{flex:1,marginBottom:0,marginTop:5,borderRadius:10,elevation:5}}>
            <Stack.Screen options={{ 
                title:'MESSAGE LIST', 
                headerTitleStyle:{fontFamily:'fontBold',fontSize:12}, 
            }} />
            <StatusBar style='light' />
            <LinearGradient colors={["#f1e8fe","#f2f7fa","#e8f5fe"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{flex:1,paddingTop:10,borderRadius:10}}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {allMessages?.length > 0 && allMessages?.slice()?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt))?.map((message: any, i:number) => {
                        const userDetails:UserProfile = message.userDetails;
                        return(
                            <TouchableOpacity onPress={() => handleMessageClicked(userDetails,message)} style={{flexDirection:'row',backgroundColor:i % 2 === 0 ? colors.faintGray : colors.white,width:'100%',padding:5}} key={userDetails?.clientId}>
                                <View style={{backgroundColor:"#63acfa",borderRadius:100,height:65,width:65,justifyContent:'center',alignItems:'center'}}>
                                    {userDetails?.avatar === "" && <Icon type='EvilIcons' name='user' size={55} color={colors.white}/>}
                                    {userDetails?.avatar !== "" && <Image source={{uri:userDetails?.avatar}} style={{width:60,height:60,borderRadius:100}} />}
                                </View>
                                <View style={{flex:1,marginLeft:10,justifyContent:'center'}}>
                                    <Text style={{fontFamily:'fontBold',color:'#63acfa'}}>{userDetails?.fname}</Text>
                                    <Text style={{fontFamily:'fontLight'}} numberOfLines={1}>{message.text}</Text>
                                </View>
                                <View style={{justifyContent:'center'}}>
                                    <Text style={{color:'#2a2828',fontFamily:'fontLight',fontSize:12}}>{moment(message.createdAt).format('MM-DD HH:mm')}</Text>
                                    {message.fromUser == accountInfo?.clientId?(
                                        <View style={{marginTop:2,alignItems:'flex-end'}}>
                                            {message.status === 0 ? (
                                                <Icon type="EvilIcons" name="check" size={25} color="#757575"/>
                                            ):(
                                                <Icon type="Feather" name="check-circle" size={18} color="green" />
                                            )}
                                        </View>
                                    ):(
                                        <View style={{marginTop:2,alignItems:'flex-end'}}>{message.status === 0 &&  <Icon type="Foundation" name="burst-new" size={20} color="green"/>}</View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                    
                </ScrollView>
            </LinearGradient>
        </Animatable.View>
    )
}

export default MessageList;