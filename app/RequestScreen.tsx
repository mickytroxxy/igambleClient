import React, {useContext,useState,useRef, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity,TouchableHighlight, ScrollView, Image} from 'react-native';
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import moment from 'moment';
// @ts-ignore
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import TextArea from '../components/ui/TextArea';
import { useDispatch } from 'react-redux';
import { setModalState } from '../state/slices/modalState';
import { Switch, TouchableRipple } from 'react-native-paper';
import { colors } from '../constants/Colors';
import { LocationType, PrivacyType, RequestType } from '../constants/Types';
import { AddressButton, Button } from '../components/ui/Button';
import useUsers from '../hooks/useUsers';
import { setActiveUser } from '../state/slices/users';
import { HeaderSection } from '../components/profile/HeaderSection';
import ForeGround from '../components/profile/ForeGround';
import { Stack, useRouter, useSearchParams } from 'expo-router';
import { currencyFormatter, showToast } from '../helpers/methods';
import { setConfirmDialog } from '../state/slices/ConfirmDialog';
import usePayment from '../hooks/usePayment';
import useMessages from '../hooks/useMessages';
import { StatusBar } from 'expo-status-bar';
import Swiper from 'react-native-swiper';
import Icon from '../components/ui/Icon';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { createData } from '../helpers/api';
export default function RequestScreen() {
    const {height} = Dimensions.get("screen");
    const parallaxH = parseInt((0.425 * height).toFixed(0));
    const dispatch = useDispatch();
    const {service,offer} = useSearchParams()
    const [currentIndex,setCurrentIndex] = useState(0);
    const {users} = useUsers();
    const handlePagination = (direction:string)=>{
        if(direction === "next"){
            if(currentIndex < (users.length - 1)){
                setCurrentIndex(currentIndex + 1)
            }
        }else{
          if(currentIndex > 0){
            setCurrentIndex(currentIndex - 1)
          }
        }
    }
    useEffect(() => {
        !service && dispatch(setActiveUser(users[currentIndex]));
    },[currentIndex])
    return (
      <View style={{flex: 1}}>
        <ParallaxScrollView
            backgroundColor="#e8e9f5"
            contentBackgroundColor="#e8e9f5"
            backgroundScrollSpeed={5}
            fadeOutForeground ={true}
            showsVerticalScrollIndicator ={false}
            parallaxHeaderHeight={parallaxH}
            renderForeground={() => <ForeGround/>}
            renderBackground={() => <HeaderSection />}
            renderContentBackground={() => <BodySection data={{service,offer,handlePagination}}  />}
        />
      </View>
  )
}
type propsType = {
    data:{
        service?:any;
        handlePagination:(args:string) => void;
        offer?:any;
    }
}
const BodySection = (props:propsType) =>{
    const dispatch = useDispatch();
    const {onSend} = useMessages();
    const router = useRouter();
    const {showAmountModal} = usePayment();
    const {data:{service,offer,handlePagination}} = props
    const {accountInfo,activeUser:activeProfile} = useUsers();
    const userPrivacy:PrivacyType[] = activeProfile?.privacy;
    const canMeet = userPrivacy?.filter(item => item.type === 'CLIENT CAN VISIT')?.[0]?.selected
    const allowsCash = userPrivacy?.filter(item => item.type === 'ALLOW CASH PAYMENT')?.[0]?.selected
    const [formData,setFormData] = useState({quantity:1,offer:0,date:new Date(Date.now()),time:new Date(Date.now() + 1000 * 60 * 60),service:'SELECT SERVICE',unitPrice:0});
    const [meetAtHost,setMeetAtHost] = useState<boolean>(false);
    const [meetUpLocation,setMeetUpLocation] = useState<LocationType>();
    const handleBtnClick = (value:LocationType) => setMeetUpLocation(value);
    const [duration,setDuration] = useState([
        {type:'HOURLY',name:'HOURS',selected:true},
        {type:'DAILY',name:'DAYS',selected:false},
        {type:'WEEKLY',name:'WEEKS',selected:false},
        {type:'MONTHLY',name:'MONTHS',selected:false},
        {type:'YEARLY',name:'YEARS',selected:false},
    ])
    const [paymentBtns,setPaymentBtns] = useState([{type:'CARD PAYMENT',selected:true},{type:'CASH PAYMENT',selected:false}])
    const selectedDuration = duration.filter(item => item.selected === true)[0]
    const handleChange = (field:string,value:string) => {
        setFormData(v =>({...v, [field] : value}))
        if(field === 'quantity'){
            if(parseFloat(value) > 0 && formData.service !== "SELECT SERVICE"){
                handleOffer(formData.service,parseFloat(value))
            }
        }
    };
    const handleOffer = (value:string,quantity:number) => {
        const selectedService = activeProfile?.services?.filter(item => item.type === value);
        const fee:any = selectedService?.[0].fees.filter(item => item.name === selectedDuration.name)?.[0]?.fee;
        if(fee){
            const offer = (fee || 0) * quantity;
            setFormData(prevState => ({...prevState,offer,unitPrice:parseFloat((fee || 0).toString())}))
        }
    }
    const handleRequestBtn = async() => {
        const balance = accountInfo?.balance;
        const paymentMethod = paymentBtns.filter(item => item.selected === true)[0].type
        if(meetUpLocation){
            if(formData?.service !== "SELECT SERVICE"){
                if((balance >= formData.offer && paymentMethod === "CARD PAYMENT") || (paymentMethod === "CASH PAYMENT")){
                    const connectionId = accountInfo?.clientId + activeProfile.clientId;
                    const fromToArray = [accountInfo?.clientId,activeProfile.clientId];
                    const obj = {...formData,date:moment(formData.date).format('L'),time:moment(formData.time).format('HH:mm'),connectionId,fromToArray,status:'PENDING',durationType:selectedDuration.name,meetUpLocation,fromUser:accountInfo?.clientId,toUser:activeProfile.clientId,paymentMethod,dateSent:Date.now()}
                    dispatch(setConfirmDialog({isVisible: true,text: `You are about to place a ${formData?.service} REQUEST for ${currencyFormatter(formData.offer)}.\nThe meeting place is ${meetUpLocation?.text}`,okayBtn: 'CONFIRM',cancelBtn: 'Cancel',severity: true,response: async(res:boolean) => {
                        if (res) {
                            router.push({pathname:'CameraScreen',params:{type:'REQUEST',data:JSON.stringify(obj)}})
                            // const response = await createData("requests",connectionId,obj);
                            // if(response){
                            //     const message = `Hi ${activeProfile.fname}, You have a new ${obj.service} REQUEST from ${accountInfo.fname}, Click on their profile to respond`
                            //     const _id:string = accountInfo.fname?.toUpperCase().slice(0, 2) + Math.floor(Math.random() * 8999999999 + 10000009999).toString();
                            //     onSend([{text:message,_id}]);
                            //     showToast("You have successfully placed your request. ");
                            //     dispatch(setModalState({isVisible:true,attr:{headerText:'SUCCESS STATUS',message:'You have successfully placed your request. ',status:true}}));
                            // }
                        }
                    }}));
                }else{
                    showToast("You don't have sufficient funds to place this request!");
                    showAmountModal();
                }
            }else{
                showToast("Please select your required service before proceeding")
            }
        }else{
            showToast("Please select your meeting place before proceeding")
        }
    }
    useEffect(() => {
        if(formData.service !== "SELECT SERVICE"){
            handleOffer(formData.service,formData.quantity)
        }
        if(service){
            setFormData(prevState => ({...prevState,offer,service}))
        }
    },[selectedDuration])
    return(
        <View style={{flex:1,marginTop:-50}}>
            <StatusBar style='light' />
            <Stack.Screen options={{ 
                headerRight: () => (
                    <TouchableWithoutFeedback onPress={()=>{
                        if(activeProfile?.clientId){
                            router.push("Profile");
                        }
                    }}>
                        <Image source={{uri: activeProfile.avatar !== "" ? activeProfile.avatar : 'https://picsum.photos/400/400'}} style={{width:40,height:40,borderRadius:100,marginRight:5,borderWidth:1,borderColor:'#5586cc'}}></Image>
                    </TouchableWithoutFeedback>
                )
            }} />
            <View style={styles.footerStyle}>
                <View style={{alignContent:'center',alignItems:'center',marginTop:-10}}>
                    <TouchableHighlight style={{alignSelf:'center',backgroundColor:'#fff',height:30,elevation:0}} >
                        <FontAwesome backgroundColor="#fff" style={{alignSelf:'center',alignItems:'center',alignContent:'center'}} name="ellipsis-h" color="#757575" size={30}></FontAwesome>
                    </TouchableHighlight>
                </View>
                {!service && 
                    <View style={{alignContent:'center',alignItems:'center',height:50,flexDirection:'row',backgroundColor:colors.faintGray,padding:5,borderRadius:15,marginBottom:10}}>
                        <View style={{flex:1}}>
                            <TouchableOpacity onPress={()=>{handlePagination("prev")}} style={{}}>
                                <Icon name='arrow-undo-circle-outline' type='Ionicons' color={colors.grey} size={36} />
                            </TouchableOpacity>
                        </View>
                        <View style={{alignContent:'flex-end',alignItems:'center',flex:1}}>
                            <TouchableOpacity onPress={()=>{handlePagination("next")}} style={{alignSelf:'flex-end'}}>
                                <Icon name='arrow-redo-circle-outline' type='Ionicons' color={colors.grey} size={36} />
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                <View style={{flexDirection:'row',borderColor:'#f2eae9',borderBottomWidth:0.8,paddingBottom:10,marginBottom:10}}>
                    <View style={{width:30,justifyContent:'center'}}>
                        <AntDesign name="Safety" size={30} color="#0e75b4"/>
                    </View>
                    <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                        <Text style={{color:'#2a2828',fontFamily:'fontBold',paddingLeft:15,fontSize:11}}>MEET AT SERVICE PROVIDER'S PLACE</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                        <TouchableRipple onPress={() => {
                            if(canMeet){
                                if(!meetAtHost){
                                    const address:any = activeProfile?.address
                                    dispatch(setConfirmDialog({isVisible: true,text: `The service provider's location is ${address.text}, Do you confirm this address?`,okayBtn: 'CONFIRM',cancelBtn: 'Cancel',severity: true,response: (res:boolean) => {
                                        if (res) {
                                            setMeetAtHost(!meetAtHost);
                                            setMeetUpLocation(address)
                                        }
                                    }}));
                                }else{
                                    setMeetAtHost(!meetAtHost)
                                }
                            }else{
                                showToast("You can not meet at this service provider's place")
                            }
                        }}>
                            <View><View pointerEvents="none"><Switch value={meetAtHost} color={colors.green} /></View></View>
                        </TouchableRipple>
                    </View>
                </View>
                {!meetAtHost && <View><AddressButton handleBtnClick={handleBtnClick} /></View>}
                <Button 
                    btnInfo={{styles:{borderRadius:10,borderColor:'#63acfa',width:'100%'}}} 
                    textInfo={{text:formData.service,color:colors.grey}} 
                    iconInfo={{type:'FontAwesome', name:'heart',color:colors.orange,size:16}}
                    handleBtnClick={() => {
                        const services = activeProfile.services?.map((item) => (item.type))
                        dispatch(setModalState({isVisible:true,attr:{headerText:'SELECT SERVICE',field:'service',items:services,handleChange:(field:string,value:any) => {
                            setFormData(prevState => ({...prevState,service:value}));
                            handleOffer(value,formData.quantity)
                        }}}))
                    }}
                />
                <View>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                        {duration.map((item,i) =>
                            <TouchableOpacity onPress={() => setDuration(duration.map(data => data.type === item.type ? {...data,selected:true} : {...data,selected:false}))} key={item.type+i} style={{borderColor:'#63acfa',backgroundColor:item.selected ? "#63acfa" : "#fff",borderWidth:0.7,borderRadius:5,padding:10,marginTop:10,marginRight:10}}>
                                <Text style={{fontFamily:'fontBold',color:item.selected ? "#fff" : "#63acfa"}}>{item.type}</Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex:1,justifyContent:'center'}}><Text style={{fontFamily:'fontBold',color:'#757575',fontSize:12}}>HOW MANY {selectedDuration.name}?</Text></View>
                        <View style={{flex:1}}>
                            <TextArea attr={{field:'quantity',icon:{name:'timer-outline',type:'Ionicons',min:2,color:'#63acfa'},keyboardType:'numeric',value:formData.quantity.toString(),placeholder:`NUMBER OF ${selectedDuration.name}`,color:'#009387',handleChange}} />
                        </View>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <View style={{flex:1,justifyContent:'center'}}><Text style={{fontFamily:'fontBold',color:'#757575',fontSize:12}}>MY OFFER IS</Text></View>
                        <View style={{flex:1}}>
                            <TextArea attr={{field:'offer',icon:{name:'attach-money',type:'MaterialIcons',min:5,color:'#63acfa'},keyboardType:'numeric',value:formData.offer.toString(),placeholder:`YOUR OFFER`,color:'#009387',handleChange}} />
                        </View>
                    </View>
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
                    <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                        {paymentBtns.map((btn,i) => 
                            <View style={{width:'49%'}} key={btn.type}>
                                <Button 
                                    btnInfo={{styles:{borderRadius:10,borderColor:'#63acfa',backgroundColor:btn.selected ? '#63acfa' : colors.white,width:'100%'}}} 
                                    textInfo={{text:btn.type,color: btn.selected ? colors.white : '#63acfa'}} 
                                    iconInfo={{type:'FontAwesome5', name: btn.type === 'CARD PAYMENT' ? 'money-check' : 'money-bill-wave',color: btn.selected ?  colors.white : '#63acfa',size:16}}
                                    handleBtnClick={() => {
                                        if(allowsCash){
                                            setPaymentBtns(paymentBtns.map(data => data.type === btn.type ? {...data,selected:true} : {...data,selected:false}))
                                        }
                                    }}
                                />
                            </View>
                        )}
                    </View>
                    <View style={{alignItems:'center',marginTop:15}}>
                        <TouchableOpacity onPress={handleRequestBtn}>
                            <FontAwesome name='check-circle' size={120} color={colors.green}></FontAwesome>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}
export const styles = StyleSheet.create({
    footerStyle: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        elevation: 10,
        paddingBottom:30
    },
});