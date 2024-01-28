import { View, TouchableWithoutFeedback, Image } from "react-native"
import { GiftedChat,Bubble,Send,InputToolbar,Day } from 'react-native-gifted-chat'

import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Icon from "../components/ui/Icon";
import useUsers from "../hooks/useUsers";
import useMessages from "../hooks/useMessages";
import { Stack, useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { setActiveUser } from "../state/slices/users";
import { useEffect } from "react";
import { updateData } from "../helpers/api";
import { StatusBar } from "expo-status-bar";

const ChatScreen = () => {
    const {messages,onSend} = useMessages();
    const {accountInfo,activeUser} = useUsers();
    const dispatch = useDispatch();
    const router = useRouter();
    useEffect(() => {
       messages.map((message) => {
            if(message.status === 0 && message.fromUser === activeUser.clientId){
                updateData("chats",message._id,{value:1,field:'status'})
            }
       }) 
    },[messages])
    return(
        <Animatable.View animation="fadeInUpBig" duration={600} useNativeDriver={true} style={{flex:1,margin:3,marginBottom:0,marginTop:5,borderRadius:10,elevation:5}}>
            <Stack.Screen options={{ 
                title:activeUser?.fname, 
                headerTitleStyle:{fontFamily:'fontBold',fontSize:12}, 
                headerRight: () => (
                    <TouchableWithoutFeedback onPress={()=>{
                        if(activeUser?.clientId){
                            router.push("Profile");
                            dispatch(setActiveUser(activeUser));
                        }
                    }}>
                        <Image source={{uri: activeUser.avatar !== "" ? activeUser.avatar : 'https://picsum.photos/400/400'}} style={{width:40,height:40,borderRadius:100,marginRight:5,borderWidth:1,borderColor:'#5586cc'}}></Image>
                    </TouchableWithoutFeedback>
                )
            }} />
            <StatusBar style='light' />
            <LinearGradient colors={["#f1e8fe","#f2f7fa","#e8f5fe"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{flex:1,paddingTop:10,borderRadius:10}}>
                <GiftedChat
                    messages={messages}
                    onSend={(messages:any) => onSend(messages)}
                    user={{
                        _id: accountInfo?.clientId,
                    }}
                    renderBubble={renderBubble}
                    alwaysShowSend
                    renderSend={renderSend}
                    scrollToBottom
                    scrollToBottomComponent={scrollToBottomComponent}
                    renderInputToolbar={props => customtInputToolbar(props)}
                    renderDay={renderDay}
                />
            </LinearGradient>
        </Animatable.View>
    )
}


const renderSend =(props:any)=>{
    return(
        <Send {...props}>
            <View style={{padding:5,justifyContent:'center',borderWidth:0,borderColor:'#fff'}}>
                <Icon type="Feather" name="send" color="#5586cc" size={36}/>
            </View>
        </Send>
    )
}
const renderBubble=(props:any)=>{
    return(
        <Animatable.View animation="flipInY" duration={1000} useNativeDriver={true}>
            <Bubble 
                {...props}
                wrapperStyle={{
                    right:{
                        backgroundColor:'#7ab6e6',
                        borderRadius:15,
                        borderBottomLeftRadius:0,
                    },
                    left:{
                        backgroundColor:'#d7e5e5',
                        borderRadius:15,
                        borderBottomRightRadius:0,
                    }
                }}
                textStyle={{
                    right:{
                        color:'#fff',
                        fontFamily:'fontLight',
                        fontSize:12
                    },
                    left:{
                        fontFamily:'fontLight',
                        fontSize:12,
                        color:'#757575'
                    }
                }}
                //timeTextStyle={{ left: { color: 'black' },right: { color:'black'} }}
            />
        </Animatable.View>
    )
}
const customtInputToolbar = (props:any) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          marginLeft:5,marginRight:5,
          marginBottom:1,
          marginTop:1,
          borderRadius:10,
          borderWidth:1,
          borderColor: "#b8bcbc",
          backgroundColor: "white",
          fontFamily:'fontLight',
        }}
      />
    );
};
const renderDay=(props:any)=> {
    return <Day {...props} textStyle={{color: '#9db9c9',fontFamily:'fontBold',backgroundColor:'#fff',padding:5,paddingLeft:10,paddingRight:10,borderRadius:20}}/>
}
const scrollToBottomComponent=()=> {
    return(
        <Icon type="FontAwesome" name="angle-double-down" size={22} color="#333"/>
    )
}
export default ChatScreen;