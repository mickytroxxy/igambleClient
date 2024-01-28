import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,Image, ScrollView
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter, useSearchParams } from "expo-router";

import { colors } from "../constants/Colors";
import { GamblingItemsType, LocationType } from "../constants/Types";
import TextArea from "../components/ui/TextArea";
import Icon from "../components/ui/Icon";
import { StatusBar } from "expo-status-bar";
import { currencyFormatter, getDistance, showToast } from "../helpers/methods";
import { useDispatch } from "react-redux";
import { setModalState } from "../state/slices/modalState";
import moment from "moment";
import { AddressButton, Button } from "../components/ui/Button";
import useUsers from "../hooks/useUsers";
import useLocation from "../hooks/useLocation";
import { setConfirmDialog } from "../state/slices/ConfirmDialog";
import { updateUser } from "../helpers/api";
import useMessages from "../hooks/useMessages";
import useGames from "../hooks/useGames";

const Claim = () => {
    const {packageParams}:any = useSearchParams();
    const packageToClaim:GamblingItemsType[] = packageParams && [JSON.parse(packageParams)];
    const {accountInfo,activeUser:activeProfile} = useUsers();
    const {onSend} = useMessages();
    const {location} = useLocation();
    const {getMyWonPackages} = useGames();
    const router = useRouter();
    const dispatch = useDispatch();
    const [formData,setFormData] = useState({date:new Date(Date.now()),time:new Date(Date.now() + 1000 * 60 * 60),address:{text:'',latitude:0,longitude:0},service:'SELECT SERVICE',serviceProvider:"MJOLO",unitPrice:0});
    const serviceProvider = formData.serviceProvider === "MY_OWN" ? accountInfo : activeProfile;
    const handleChange = (field:string,value:string) => {
        setFormData(v =>({...v, [field] : value}))
    };
    const handleBtnClick = (value:any) => setFormData(v =>({...v, address : value}));
    const handleClaimBtn = () => {
        const address:LocationType = formData.address;
        const obj = {...formData,date:moment(formData.date).format('L'),time:moment(formData.time).format('HH:mm'),guest:serviceProvider.clientId,dateSent:Date.now()}
        let text = `You are about to claim your ${packageToClaim[0].class} package. You also stated that you would like to bring your own guest at ${formData.address.text} on ${moment(formData.date).format('L')} at ${moment(formData.time).format('HH:mm')}`
        if(serviceProvider.clientId !== accountInfo?.clientId){
            text = `You are about to claim your ${packageToClaim[0].class} package. You also stated that you would like to bring ${activeProfile.fname} at ${formData.address.text} on ${moment(formData.date).format('L')} at ${moment(formData.time).format('HH:mm')} as your guest`
        }
        dispatch(setConfirmDialog({isVisible: true,text,okayBtn: 'CONFIRM',cancelBtn: 'Cancel',severity: true,response: async(res:boolean) => {
            if (res) {
                const response = await updateUser("bettings",packageToClaim?.[0].transactionId,{status:1,claimData:obj});
                if(response){
                    const _id:string = accountInfo.fname?.toUpperCase().slice(0, 2) + Math.floor(Math.random() * 8999999999 + 10000009999).toString();
                    if(serviceProvider.clientId !== accountInfo.clientId){
                        onSend([{text:`Hello ${serviceProvider.fname}, You have been booked by ${accountInfo.fname} to attend a ${packageToClaim[0].class} win package at ${address.text} on ${moment(formData.date).format('L')} at ${moment(formData.time).format('HH:mm')}`,_id}]);
                    }
                    showToast("You have successfully placed your request. ");
                    router.back();
                    getMyWonPackages();
                    dispatch(setModalState({isVisible:true,attr:{headerText:'SUCCESS STATUS',message:`You have successfully placed your claim request of ${packageToClaim[0].class} package.\nWe will contact you to arrange your event `,status:true}}));
                }
            }
        }}));
    }
    return (
        <View style={styles.container}>
            <Stack.Screen options={{title:'CLAIM MY PACKAGE', headerTitleStyle:{fontFamily:'fontBold',fontSize:12}}} />
            <StatusBar style='light' />
            <LinearGradient colors={["#fff", "#fff", "#fff", "#f1f7fa"]} style={styles.gradientContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flexDirection:'row'}}>{[1,2,3,4,5,6,7,8,9,10].map((item) => <View key={item} style={{width:'10%',alignItems:'center'}}><Icon type='MaterialIcons' name="star" size={30} color={colors.orange} /></View>)}</View>
                    {packageToClaim?.map((item, i) => {
                        return(
                            <View key={item.id * i} style={{marginBottom:15,backgroundColor:colors.faintGray,borderRadius:5,padding:10}}>
                                <View style={{flexDirection:'row',margin:5,backgroundColor:"#FFAEA2",padding:5,borderRadius:5,height:50,justifyContent:'center'}}>
                                    <View style={{flex:1,justifyContent:'center'}}><Text style={{fontFamily:'fontBold',fontSize:13,color:colors.white}}>{item.class}</Text></View>
                                    <View style={{justifyContent:'center'}}><Text style={{fontFamily:'fontBold',fontSize:13,color:colors.white}}>EST {currencyFormatter(item.totalCost)}</Text></View>
                                </View>
                                {item?.items?.map((innerItem) => 
                                    <View key={innerItem} style={{flexDirection:'row',padding:5}}>
                                        <View style={{flex:1}}><Icon type='MaterialIcons' name="check-circle" size={16} color={colors.green} /></View>
                                        <View><Text style={{fontFamily:'fontLight',fontSize:11}}>{innerItem}</Text></View>
                                    </View>
                                )}
                                <View style={{padding:5,backgroundColor:colors.white,borderRadius:5}}>
                                    <Text style={{fontFamily:'fontLight',fontSize:12}}>{item.description}</Text>
                                </View>
                                
                            </View>
                        )
                    })}
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex:1,justifyContent:'center'}}><Text style={{fontFamily:'fontBold',color:'#757575',fontSize:12}}>DATE</Text></View>
                        <View style={{flex:1}}>
                            <TouchableOpacity onPress={()=>dispatch(setModalState({isVisible:true,attr:{headerText:'SELECT DATE',field:'date',handleChange}}))} style={{borderColor:'#a8a6a5',borderWidth:1,borderRadius:10,padding:10,marginTop:5}}>
                                <Text style={{fontFamily:'fontLight'}}>{moment(formData.date).format("L")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex:1,justifyContent:'center'}}><Text style={{fontFamily:'fontBold',color:'#757575',fontSize:12}}>TIME</Text></View>
                        <View style={{flex:1}}>
                        <TouchableOpacity onPress={()=> dispatch(setModalState({isVisible:true,attr:{headerText:'SELECT TIME',field:'time',handleChange}}))} style={{borderColor:'#a8a6a5',borderWidth:1,borderRadius:10,padding:10,marginTop:5}}>
                            <Text style={{fontFamily:'fontLight'}}>{moment(formData.time).format("HH:mm")}</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                
                    <View style={{alignItems:'center',marginTop:30}}>
                        <TouchableOpacity onPress={handleClaimBtn}>
                            <Icon type="FontAwesome" name='check-circle' size={120} color="green"/>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
        </View>
    );
};

export default Claim;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
    marginTop: 5,
    borderRadius: 10,
    elevation: 5,
  },
  gradientContainer: {
    flex: 1,
    padding:10

  },
  text: {
    fontFamily: "fontLight",
    marginBottom: 15,
    textAlign: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginTop: 15,
  },
  searchInputContainer: {
    height: 40,
    borderRadius: 10,
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: "#a8a6a5",
  },
  myBubble: {
    backgroundColor: "#7ab6e6",
    padding: 5,
    minWidth: 100,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
