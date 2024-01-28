import React, { memo } from 'react'
import { View, TouchableOpacity, Text, Image, Platform } from 'react-native'
import { AntDesign,FontAwesome, MaterialIcons } from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable';
import { Col, Grid } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import {TouchableRipple,Switch} from 'react-native-paper';
import { GlobalStyles } from '../../../styles';
import { useDispatch } from 'react-redux';
import { setModalState } from '../../../state/slices/modalState';
import { LocationType, UserProfile } from '../../../constants/Types';
import { colors } from '../../../constants/Colors';
import useUpdates from '../../../hooks/useUpdates';
import useUsers from '../../../hooks/useUsers';
import { setAccountInfo } from '../../../state/slices/accountInfo';
import { updateData } from '../../../helpers/api';
import { setConfirmDialog } from '../../../state/slices/ConfirmDialog';
import { showToast } from '../../../helpers/methods';
import { useRouter } from 'expo-router';
import { setActiveUser } from '../../../state/slices/users';
import { AddressButton } from '../../ui/Button';
interface AboutProps {
    data?: {
      profileOwner?: boolean;
      activeProfile?: UserProfile;
    };
}
const About = memo((props:AboutProps) => {
    const {profileOwner,activeProfile} = props?.data || {};
    const {accountInfo} = useUsers();
    const router = useRouter();
    const dispatch = useDispatch();
    let blocked = accountInfo?.blocked?.filter((user:UserProfile) => user === activeProfile?.clientId).length > 0;
    let iReported = activeProfile?.reports && activeProfile.reports.filter((user) => user?.clientId === accountInfo?.clientId).length > 0;
    const {handleChange,handleUploadPhotos} = useUpdates();
    const editProfile = (field:string) => {
        if(field === 'selfiePhoto' || field === 'idPhoto'){
            handleUploadPhotos(field)
        }else if(field === 'birthDay'){
            dispatch(setModalState({isVisible:true,attr:{headerText:'SELECT DATE',field,handleChange}}));
        }else if(field === 'facebookLink'){
            dispatch(setModalState({isVisible:true,attr:{headerText:'FACEBOOK LINK',field,placeholder:'Paste Your Facebook Link...',handleChange}}))
        }else if(field === 'about'){
            dispatch(setModalState({isVisible:true,attr:{headerText:'YOUR ABOUT',field,multiline:true,value:activeProfile?.about,placeholder:'Tell Us About Yourself...',handleChange}}))
        }else if(field === 'gender'){
            dispatch(setModalState({isVisible:true,attr:{headerText:'SELECT GENDER',field,items:['FEMALE','MALE'],handleChange}}))
        }
    }
    const handlePrivacy = (data:any) => {
        const privacy = activeProfile?.privacy.map((item:any) => item.type === data.type ? {...item,selected:!data.selected} : item)
        handleChange('privacy',privacy);
    }
    const handleBtnClick = (value:LocationType) => handleChange("address",value);
    const handleBlockReport = (action:string) => {
        if(action === 'block'){
            let currentData:any = [...accountInfo?.blocked||[]];
            if(!blocked){
                currentData = [...currentData,activeProfile?.clientId];
            }else{
                currentData.splice(currentData.indexOf(activeProfile?.clientId), 1)
            }
            dispatch(setAccountInfo({...accountInfo,blocked:currentData}))
            updateData("users",(accountInfo?.clientId || ''),{value:currentData,field:"blocked"})
        }else if(action === 'delete'){
            dispatch(setConfirmDialog({isVisible: true,text: `Are you sure you want to delete your account? Deleted account can not be restored`,okayBtn: 'Cancel',cancelBtn: 'Delete',severity: true,response: (res:boolean) => {
                if (!res) {
                    router.push("SplashScreen")
                    dispatch(setAccountInfo(null));
                    updateData("users",(accountInfo?.clientId || ''),{value:true,field:"deleted"});
                    showToast("Your account has been successfully deleted");
                }
            }}));
        }else if(action === 'report'){
            if(!iReported){
                dispatch(setModalState({isVisible:true,attr:{headerText:'REPORT USER',field:'reports',multiline:true,placeholder:'Explain in detail your issue...',handleChange:(field:string,value:string)=>{
                    let currentData:any = [...activeProfile?.reports||[]];
                    currentData = [...currentData,{clientId:accountInfo?.clientId,issue:value,date:Date.now()}];
                    dispatch(setActiveUser({...activeProfile,reports:currentData}))
                    updateData("users",(activeProfile?.clientId || ''),{value:currentData,field:"reports"});
                    showToast("You have successfully reported this user!")
                }}}))
            }else{
                showToast("You have already reported this user")
            }
        }
    }
    return (
        <Animatable.View animation="bounceIn" duration={1000} useNativeDriver={true} style={{padding:5 }}>
            <View style={{ padding:5 }}>
                <LinearGradient colors={["#e2f2f5", "#f9d0c7"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{borderRadius:10,}}>
                    <View style={GlobalStyles.recentItem}>
                        <View style={GlobalStyles.activityIndicator}>
                            <FontAwesome name="user-circle" color="#f9d0c7" size={24}></FontAwesome>
                        </View>
                        <View style={{ flex:3,backgroundColor:'#fff',borderRadius:10, }}>
                            <View style={{padding:10,backgroundColor:'#f9f4f7',flex:1,flexDirection:'row',borderTopLeftRadius:10,borderTopRightRadius:10}}>
                                <Text style={[GlobalStyles.text, { flex:3,fontSize:14,fontFamily:'fontBold',color:'#757575' }]}>ABOUT</Text>
                                {profileOwner?(
                                    <TouchableOpacity onPress={() => editProfile("about")}>
                                        <FontAwesome name="edit" color="#c5c3c8" size={24}></FontAwesome>
                                    </TouchableOpacity>
                                ):null}
                            </View>
                            <View style={{padding:10}}>
                                <Text style={[GlobalStyles.text, { color: "#41444B", fontWeight: "300",fontFamily:'fontLight' }]}>{activeProfile?.about}</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>
            </View>
            <View style={{flexDirection:'row',borderColor:'#f2eae9',borderBottomWidth:0.8,paddingBottom:10,marginBottom:10}}>
                <View style={{width:30}}>
                    <FontAwesome name="child" size={30} color="#f9d0c7"/>
                </View>
                <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                    <Text style={{color:'#2a2828',fontFamily:'fontBold',paddingLeft:15}}>AGE</Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#2a2828',fontFamily:'fontLight',marginRight:10}}>{ageCalculator(activeProfile?.birthDay || '').toFixed(0)}</Text>
                    {profileOwner &&(
                        <TouchableOpacity onPress={() => editProfile("birthDay")}>
                            <FontAwesome name="edit" color="#c5c3c8" size={24}></FontAwesome>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <View style={{flexDirection:'row',borderColor:'#f2eae9',borderBottomWidth:0.8,paddingBottom:10,marginBottom:10}}>
                <View style={{width:30}}><FontAwesome name="mars" size={30} color="#f9d0c7"/></View>
                <View style={{justifyContent:'center',alignContent:'center',flex:1}}><Text style={{color:'#2a2828',fontFamily:'fontBold',paddingLeft:15}}>GENDER</Text></View>
                <View style={{flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#2a2828',fontFamily:'fontLight',marginRight:10}}>{activeProfile?.gender}</Text>
                    {profileOwner &&(
                        <TouchableOpacity onPress={() => editProfile("gender")}>
                            <FontAwesome name="edit" color="#c5c3c8" size={24}></FontAwesome>
                        </TouchableOpacity>
                    )}
                </View>
            </View> 
            {profileOwner &&
                <View>
                    <Text style={{fontFamily:'fontBold',color:'#0e75b4', fontSize:12}}>LOCATED AT</Text>
                    <AddressButton placeholder={activeProfile?.address?.text} handleBtnClick={handleBtnClick} />
                </View>
            }
            
            {profileOwner &&
                <Grid style={{marginTop:25 }}>
                    <Col style={{justifyContent:'center',alignItems:'center',alignContent:'center'}}>
                        <View style={{height:75,width:75,borderRadius:100,overflow:'hidden'}}>
                            <LinearGradient colors={["#e44528","#d6a8e7","#f3bf4f"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{width:75,height:75,alignItems:'center',justifyContent:'center'}}>  
                                <TouchableOpacity style={{alignContent:'center',alignItems:'center',justifyContent:'center',backgroundColor:'#fff',height:72,width:72,borderRadius:100}}>
                                    {activeProfile?.idPhoto !== "" && <Image source={{uri: activeProfile?.idPhoto}} style={{width:70,height:70,borderRadius:100}} blurRadius={10} resizeMode="cover"/>}
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                        <Text style={{ color: "#000",fontSize:10,fontFamily:'fontLight',alignContent:'center',alignItems:'center',textAlign:'center' }}>ID PHOTO</Text>
                        {profileOwner && <TouchableOpacity onPress={()=> editProfile("idPhoto")}><FontAwesome name="edit" color="#c5c3c8" size={24}/></TouchableOpacity>}
                    </Col>
                    <Col style={{justifyContent:'center',alignItems:'center',alignContent:'center'}}>
                        <TouchableOpacity>
                            <FontAwesome name="facebook" color="#0e75b4" size={75}></FontAwesome>
                        </TouchableOpacity>
                        <Text style={{ color: "#000",fontSize:10,fontFamily:'fontLight',alignContent:'center',alignItems:'center', textAlign:"center" }}>FACEBOOK LINK</Text>
                        {profileOwner && <TouchableOpacity onPress={()=>editProfile("facebookLink")}><FontAwesome name="edit" color="#c5c3c8" size={24}/></TouchableOpacity>}
                    </Col>    
                    <Col style={{justifyContent:'center',alignItems:'center',alignContent:'center'}}>
                        <View style={{height:75,width:75,borderRadius:100,overflow:'hidden'}}>
                            <LinearGradient colors={["#e44528","#d6a8e7","#f3bf4f"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{width:75,height:75,alignItems:'center',justifyContent:'center'}}>  
                                <TouchableOpacity style={{alignContent:'center',alignItems:'center',justifyContent:'center',backgroundColor:'#fff',height:72,width:72,borderRadius:100,}}>
                                    {activeProfile?.selfiePhoto !== "" &&  <Image source={{uri: activeProfile?.selfiePhoto}} style={{width:70,height:70,borderRadius:100,}} resizeMode="cover"/>}
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                        <Text style={{ color: "#000",fontSize:10,fontFamily:'fontLight',alignContent:'center',alignItems:'center', textAlign:'center' }}>SELFIE PHOTO</Text>
                        {profileOwner && <TouchableOpacity onPress={()=>editProfile("selfiePhoto")}><FontAwesome name="edit" color="#c5c3c8" size={24}/></TouchableOpacity>}
                    </Col>           
                </Grid>
            }
            {activeProfile?.type === "SERVICE PROVIDER" && <View style={{backgroundColor:'#eae6e8',borderRadius:5,marginTop:20,marginBottom:20,padding:20}}><Text style={{fontFamily:'fontBold',color:'#0e75b4'}}>PRIVACY & SECURITY</Text></View>  }
            
            {activeProfile?.type === 'SERVICE PROVIDER' && activeProfile?.privacy.map((item:any,i:number) => (
                <View key={item.type + i} style={{flexDirection:'row',borderColor:'#f2eae9',borderBottomWidth:0.8,paddingBottom:10,marginBottom:10}}>
                    <View style={{width:30,justifyContent:'center'}}>
                        <AntDesign name="Safety" size={30} color="#0e75b4"/>
                    </View>
                    <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                        <Text style={{color:'#2a2828',fontFamily:'fontBold',paddingLeft:15,fontSize:Platform.OS === 'android' ? 10 : 12}}>{item.type}</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                        {profileOwner ? (
                            <TouchableRipple onPress={() => handlePrivacy(item)}>
                                <View>
                                    <View pointerEvents="none">
                                        <Switch value={item.selected} color={colors.green} />
                                    </View>
                                </View>
                            </TouchableRipple>
                        ):(
                            <View>{item.selected ? <FontAwesome name="check-circle" size={30} color="green" alignSelf="center"/> : <FontAwesome name="times-circle" size={30} color="tomato" alignSelf="center"/>}</View>
                        )}
                    </View>
                </View>
            ))}
            {!profileOwner &&
                <View style={{flexDirection:'row',borderColor:'#f2eae9',borderBottomWidth:0.8,paddingBottom:10,marginBottom:10}}>
                    <View style={{width:30,justifyContent:'center'}}>
                        <MaterialIcons name="block" size={30} color={colors.tomato}/>
                    </View>
                    <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                        <Text style={{color:'#2a2828',fontFamily:'fontBold',paddingLeft:15,fontSize:Platform.OS === 'android' ? 10 : 12}}>{!blocked ? "BLOCK ACCOUNT" : "UNBLOCK ACCOUNT"}</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                        <TouchableRipple onPress={() => handleBlockReport("block")}>
                            <View>
                                <View pointerEvents="none">
                                    <Switch value={blocked} color={colors.tomato} />
                                </View>
                            </View>
                        </TouchableRipple>
                    </View>
                </View>
            }
            {!profileOwner &&
                <View style={{flexDirection:'row',borderColor:'#f2eae9',borderBottomWidth:0.8,paddingBottom:10,marginBottom:10}}>
                    <View style={{width:30,justifyContent:'center'}}>
                        <MaterialIcons name="report" size={30} color={colors.tomato}/>
                    </View>
                    <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                        <Text style={{color:'#2a2828',fontFamily:'fontBold',paddingLeft:15,fontSize:Platform.OS === 'android' ? 10 : 12}}>REPORT USER</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                        <TouchableRipple onPress={() => handleBlockReport("report")}>
                            <View>
                                <View pointerEvents="none">
                                    <Switch value={iReported} color={colors.tomato} />
                                </View>
                            </View>
                        </TouchableRipple>
                    </View>
                </View>
            }
            {profileOwner &&
                <View style={{flexDirection:'row',borderColor:'#f2eae9',borderBottomWidth:0.8,paddingBottom:10,marginBottom:10}}>
                    <View style={{width:30,justifyContent:'center'}}>
                        <FontAwesome name="times-circle" size={30} color={colors.tomato}/>
                    </View>
                    <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                        <Text style={{color:'#2a2828',fontFamily:'fontBold',paddingLeft:15,fontSize:Platform.OS === 'android' ? 10 : 12}}>DELETE ACCOUNT</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                        <TouchableRipple onPress={() => handleBlockReport("delete")}>
                            <View>
                                <View pointerEvents="none">
                                    <Switch value={accountInfo?.deleted} color={colors.tomato} />
                                </View>
                            </View>
                        </TouchableRipple>
                    </View>
                </View>
            }
        </Animatable.View>
    )
})
const ageCalculator = (birthDay: any): number => {
    var [month, day, year] = birthDay.split("/");
    var birth: number = new Date(year, month - 1, day).getTime();
    var check: number = new Date().getTime();
    var milliDay: number = 1000 * 60 * 60 * 24;
    var ageInDays: number = (check - birth) / milliDay;
    var age: number = ageInDays / 365;
    return age;
};
export default About