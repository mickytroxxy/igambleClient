import 'react-native-gesture-handler';
import { Text, View, StyleSheet, Image, ScrollView,TouchableOpacity, Platform } from 'react-native';
import { Ionicons, MaterialIcons,FontAwesome, Foundation } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { memo, useEffect, useRef, useState } from 'react';
import Constants from 'expo-constants'
import * as Animatable from 'react-native-animatable';
import { colors } from '../../constants/Colors';
import { Button } from '../ui/Button';
import { useRouter } from 'expo-router';
import { setActiveUser } from '../../state/slices/users';
import Icon from '../ui/Icon';
import { Notifications, registerForPushNotificationsAsync, showToast } from '../../helpers/methods';
import useMessages from '../../hooks/useMessages';
import { GamblingItemsType } from '../../constants/Types';
import { getMyWins, loginApi } from '../../helpers/api';
import { setModalState } from '../../state/slices/modalState';
import useGames from '../../hooks/useGames';

const Filter = () =>{
    const accountInfo = useSelector((state: RootState) => state.accountInfo);
    const {packages} = useSelector((state: RootState) => state.game);
    const {unSeenMessages} = useMessages();
    const {getMyWonPackages} = useGames();
    const dispatch = useDispatch();
    const router = useRouter();
    const requestPreference = [
        {category:'ANY',selected:true},
        {category:'MASSAGE',selected:false},
        {category:'DINNER MATE',selected:false},
        {category:'DRINK MATE',selected:false},
        {category:'FAKE PARTNER',selected:false},
        {category:'DANCER',selected:false},
        {category:'DRIVER',selected:false},
        {category:'PVT SECURITY',selected:false}
    ]
    const [preferenceTypes,setPreferenceTypes] = useState(requestPreference)

    const [mainCategories,setMainCategories] = useState([{category:'REQUEST',selected:true},{category:'PLAY & WIN',selected:false}])
    const mainCategory = mainCategories.filter(item => item.selected === true)[0].category;

    const notificationListener:any = useRef();
    const responseListener:any = useRef();
    
    useEffect(() => {
        getMyWonPackages();
        registerForPushNotificationsAsync(accountInfo?.clientId);
        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
        };
    },[])
    const selfieResponse = (url:string) => {
        alert("Got it")
    }
    return(
        <View style={{position:'absolute',width:'100%',zIndex:1000,padding:10,top: Constants.statusBarHeight}}>
            <View style={Platform.OS === 'ios' ? styles.interestViewIos : styles.interestView}>
                <LinearGradient colors={["#f9f1ed","#f3f9fe","#faf8fa","#f7f3d0"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{backgroundColor:'#f9f1ed',justifyContent:'center',padding:5,borderRadius:10}}>
                    <View style={{flexDirection:'row',marginVertical:10}}>
                        <TouchableOpacity onPress={() => {
                            dispatch(setModalState({isVisible:true,attr:{headerText:'ENTER ADMIN PASSWORD',field:'reports',placeholder:'Enter your admin password!',isPassword:true,handleChange:async(field:string,value:string)=>{
                                const response = await loginApi(accountInfo?.phoneNumber,value);
                                if(response.length > 0){
                                    dispatch(setActiveUser(accountInfo));
                                    router.push("Profile");
                                }else{
                                    showToast("Invalid admin details")
                                }
                            }}}))
                        }} style={{backgroundColor : "#fff",width:'100%',borderRadius:10,padding:15,borderColor:'#63acfa',borderWidth:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontFamily:'fontBold',color:"#63acfa",fontSize:13,flex:1}}>ADMIN SECTION</Text>
                            <Icon type="MaterialIcons" name="admin-panel-settings" color="green" size={48} />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
                
            </View>
            {/* <Animatable.View animation="zoomIn" duration={2000} useNativeDriver={true} style={{position:'absolute',left:10,top:'120%',backgroundColor:'rgba(0, 0, 0, 0.5)',borderTopRightRadius:30,borderBottomLeftRadius:30,alignItems:'center',padding:5,paddingBottom:30}}>
                <TouchableOpacity onPress={() => {
                    dispatch(setActiveUser(accountInfo));
                    router.push("Profile");
                }} style={{backgroundColor:"#63acfa",borderRadius:100,height: Platform.OS === 'ios' ? 75 : 65,width:Platform.OS === 'ios' ? 75 : 65,justifyContent:'center',alignItems:'center'}}>
                    {accountInfo?.avatar === "" && <Icon type='EvilIcons' name='user' size={Platform.OS === 'ios' ? 75 : 65} color={colors.white}/>}
                    {accountInfo?.avatar !== "" && <Image source={{uri:accountInfo?.avatar}} style={{width:Platform.OS === 'ios' ? 65 : 55,height:Platform.OS === 'ios' ? 65 : 55,borderRadius:100}} />}
                </TouchableOpacity>
                <TouchableOpacity style={{marginTop:15}} onPress={() => {
                    dispatch(setActiveUser(accountInfo));
                    if(packages.length > 0){
                        dispatch(setModalState({isVisible:true,attr:{headerText:'CLAIM PACKAGE',claim:true,status:true,packages}}))
                    }else{
                        showToast("No won packages available")
                    }
                }}>
                    <Icon type='FontAwesome' name='gift' size={50} color={colors.orange}/>
                </TouchableOpacity>
            </Animatable.View> */}
            
        </View>
    )
};
const styles = StyleSheet.create({
    interestView:{
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
          width: 10,
          height: 10,
        },
        shadowOpacity: 1,
        shadowRadius: 3.84,
        borderRadius:10,
        elevation: Platform.OS === 'ios' ? 0 : 30,
    },
    interestViewIos:{
        backgroundColor: '#fff',
        borderRadius:10,
        borderColor:'#F9B030',
        borderWidth:1
        
    },
    interestListItem:{
        justifyContent:'center',alignContent:'center',
        alignItems:'center',marginLeft:10,marginRight:10,
        padding:7,backgroundColor:'pink',
        borderRadius:30,display:'flex',flexDirection:'row'
    },
    lowerInterestList:{
        height:10,
        width:'100%',borderTopRightRadius:30,
        borderTopLeftRadius:30,

        borderTopWidth:0.5,
        borderRightWidth:0.7,
        borderLeftWidth:0.7,
        borderTopColor:'#dcdbd8',
        borderLeftColor:'#dcdbd8',
        borderRightColor:'#dcdbd8',
    }
});
export default memo(Filter);
