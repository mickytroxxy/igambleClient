import 'react-native-gesture-handler';
import React from 'react';
import { Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GlobalStyles } from '../../../styles';
import { RequestType, UserProfile } from '../../../constants/Types';
import { useRouter } from 'expo-router';
import Icon from '../../ui/Icon';
import { colors } from '../../../constants/Colors';
import { currencyFormatter, getDistance, nativeLink, showToast } from '../../../helpers/methods';
import useRequests from '../../../hooks/useRequests';
import { useDispatch } from 'react-redux';
import { setConfirmDialog } from '../../../state/slices/ConfirmDialog';
import { setModalState } from '../../../state/slices/modalState';
import useUpdates from '../../../hooks/useUpdates';
import useLocation from '../../../hooks/useLocation';

interface RequestBtnsProps {
  data: {
    accountInfo: any;
    activeProfile: UserProfile;
    profileOwner: boolean;
  };
}

export const RequestBtns: React.FC<RequestBtnsProps> = ({ data }) => {
  const {requestData,activeUser:activeProfile,profileOwner,accountInfo,handleCancelRequest,handleAcceptRequest,handleArriveRequest} = useRequests();
  const lastRequest:RequestType = requestData[requestData?.length - 1];
  const isRequester = lastRequest?.fromUser === accountInfo?.clientId;
  const {location} = useLocation();
  const isCash = lastRequest?.paymentMethod === "CASH PAYMENT";
  const services = activeProfile.services;
  const navigation = useRouter();
  const dispatch = useDispatch();
  const {handleChange} = useUpdates();
  const getGradient = (i: number) => (!(i % 2) ? ['#e44528', '#d6a8e7', '#f3bf4f'] : ['#92e6f5', '#c792f5']);

  return (
    <Animatable.View animation="slideInLeft" duration={1000} useNativeDriver>
      {requestData.length === 0 && 
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ padding: 10, paddingRight: 20 }}>
          {services?.map((item, i) => (
            <View style={GlobalStyles.actionViewBtnContainer} key={item.type + i}>
              <LinearGradient colors={getGradient(i)} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={[GlobalStyles.actionViewBtn]}>
                <TouchableOpacity onPress={() => {
                  if(!profileOwner){
                    navigation.push({pathname:"RequestScreen",params:{service:item.type,offer:item.fees[0].fee}})
                  }else{
                    dispatch(setModalState({isVisible:true,attr:{headerText:'SETUP YOUR RATES',fees:item.fees,service:item.type,updatePrices:(service:string,fees:any)=>{
                      let updatedServices = services.map(item => item.type === service ? {...item,fees} : {...item,fees:item.fees})
                      if(fees === "DELETE_SERVICE"){
                        updatedServices = services.filter(serviceItem => serviceItem.type !== service)
                      }
                      handleChange('services',updatedServices)
                    }}}))
                  }
                }} style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <Text style={{ fontFamily: 'fontBold', fontSize: 12, color: '#fff' }}>R {parseFloat(item.fees[0].fee.toString()).toFixed(2)}</Text>
                  <FontAwesome name="heart" color="tomato" size={30} />
                  <Text style={{ fontFamily: 'fontBold', fontSize: Platform.OS === 'ios' ? 10 : 8, color: '#fff' }}>{item.type}</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          ))}
          {(profileOwner && activeProfile.type === 'SERVICE PROVIDER') &&
            <View style={GlobalStyles.actionViewBtnContainer}>
              <LinearGradient colors={getGradient(services?.length || 0)} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={[GlobalStyles.actionViewBtn]}>
                <TouchableOpacity onPress={() => {
                  dispatch(setModalState({isVisible:true,attr:{headerText:'SERVICE NAME',hint:'Type your service name then you can update your rates after',field:'',placeholder:'Enter Service Name',handleChange:(field:string,value:string)=>{
                    if(value.length > 4){
                      const updatedServices = [...services || [], {type:value.toUpperCase(),fees:[{type:'HOURLY',fee:0,name:'HOURS'},{type:'DAILY',fee:0,name:'DAYS'},{type:'WEEKLY',fee:0,name:'WEEKS'},{type:'MONTHLY',fee:0,name:'MONTHS'},{type:'YEARLY',fee:0,name:'YEARS'}]}]
                      handleChange('services',updatedServices)
                    }else{
                      showToast("Please enter a valid service name!")
                    }
                  }}}))
                }} style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <MaterialIcons name="add-circle" color="green" size={48} />
                  <Text style={{ fontFamily: 'fontBold', fontSize: Platform.OS === 'ios' ? 10 : 8, color: '#fff' }}>ADD SERVICE</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          }
        </ScrollView>
      }

      {lastRequest?.status === "PENDING" &&
        <View style={{flexDirection:'row',marginTop:10}}>
          {!isRequester &&
            <View style={{height:60,width:60,borderRadius:100,overflow:'hidden'}}>
              <LinearGradient colors={["#e44528","#d6a8e7","#f3bf4f"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{width:60,height:60,alignItems:'center',justifyContent:'center'}}>  
                <TouchableOpacity style={{alignContent:'center',alignItems:'center',justifyContent:'center',backgroundColor:'#fff',height:57,width:57,borderRadius:100,}} onPress={() => {
                  const lightText = isCash ? ", So please make sure you collect your cash before any service commences" : ", So your payment will reflect into your bank account associated with your account"
                  let text = `Are you sure you want to eccept this ${lastRequest.service} REQUEST for ${currencyFormatter(lastRequest?.offer)}. This is ${lastRequest?.paymentMethod}${lightText}\n\nOn ${lastRequest?.date}.\nAt ${lastRequest?.time}.\n\nAddress is ${lastRequest?.meetUpLocation?.text}`
                  dispatch(setConfirmDialog({isVisible: true,text,okayBtn: 'ACCEPT',cancelBtn: 'CANCEL',severity: true,response: (res:boolean) => {
                    if (res) {
                      handleAcceptRequest(lastRequest?.connectionId,lastRequest?.offer,isCash,lastRequest?.service);
                    }
                  }}));
                }}>
                  <Icon type='MaterialIcons' name="check-circle" size={36} color={colors.green} />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          }
          <View style={{flex:1,height:58,justifyContent:'center',marginRight:5,marginLeft:5}}>
            <LinearGradient colors={["#e44528","#d6a8e7","#f3bf4f"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={[GlobalStyles.requestTypeViewHolder]}>
              <View style={{height:56,backgroundColor:colors.white,width:'100%',borderRadius:20,justifyContent:'center'}}>
                <Text style={[{fontFamily:'fontBold',fontSize:11,textAlign:'center'}]}>{lastRequest.service} ({currencyFormatter(lastRequest.offer || '0')})</Text>
              </View>
            </LinearGradient>
          </View>
          <View style={{height:60,width:60,borderRadius:100,overflow:'hidden'}}>
            <LinearGradient colors={["#e44528","#d6a8e7","#f3bf4f"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{width:60,height:60,alignItems:'center',justifyContent:'center'}}>  
              <TouchableOpacity style={{alignContent:'center',alignItems:'center',justifyContent:'center',backgroundColor:'#fff',height:57,width:57,borderRadius:100,}} onPress={() => {
                let text = `Are you sure you want to cancel this ${lastRequest.service} REQUEST`
                if(!isRequester){text = `Are you sure you want to cancel this ${lastRequest.service} REQUEST. The request is worthy ${currencyFormatter(lastRequest?.offer)}`}
                dispatch(setConfirmDialog({isVisible: true,text,okayBtn: 'NOT NOW',cancelBtn: 'TERMINATE',severity: true,response: (res:boolean) => {
                  if (!res) {
                    handleCancelRequest(lastRequest?.connectionId);
                  }
                }}));
              }}>
                <Icon type='MaterialIcons' name="cancel" size={36} color={colors.tomato} />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      }

      {lastRequest?.status === "ACCEPTED" && 
        <Animatable.View animation="slideInLeft" duration={1000} useNativeDriver={true}>
          <View style={{flex:1,height:58,justifyContent:'center',marginTop:10}}>
            <LinearGradient colors={["#e44528","#d6a8e7","#f3bf4f"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={[GlobalStyles.requestTypeViewHolder]}>
              <View style={{height:56,backgroundColor:colors.white,width:'100%',borderRadius:20,justifyContent:'center'}}>
                <Text style={[{fontFamily:'fontBold',fontSize:11,textAlign:'center'}]}>{lastRequest.service} ({currencyFormatter(lastRequest.offer || '0')})</Text>
              </View>
            </LinearGradient>
          </View>
          <View style={{flexDirection:'row',marginTop:10,marginBottom:5,paddingBottom:5,borderBottomColor:colors.white,borderBottomWidth:2}}>
            <View style={{flex:1}}>
              <View style={{height:60,width:60,borderRadius:100,overflow:'hidden'}}>
                <LinearGradient colors={["#e44528","#d6a8e7","#f3bf4f"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{width:60,height:60,alignItems:'center',justifyContent:'center'}}>  
                  <TouchableOpacity style={{alignContent:'center',alignItems:'center',justifyContent:'center',backgroundColor:'#fff',height:57,width:57,borderRadius:100,}} onPress={() => {nativeLink("call",{phoneNumber:(activeProfile?.phoneNumber || '')})}}>
                    <Icon type='MaterialIcons' name="phone" size={36} color={colors.green} />
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
            <View style={{flex:1,alignItems:'center'}}>
              <View style={{height:60,width:60,borderRadius:100,overflow:'hidden'}}>
                <LinearGradient colors={["#e44528","#d6a8e7","#f3bf4f"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{width:60,height:60,alignItems:'center',justifyContent:'center'}}>  
                  <TouchableOpacity style={{alignContent:'center',alignItems:'center',justifyContent:'center',backgroundColor:'#fff',height:57,width:57,borderRadius:100,}} onPress={() => {
                    let text = `Are you sure you want to cancel this ${lastRequest.service} REQUEST.\nThis request has been accepted and additional charges may apply`
                    if(!isRequester){
                      text = `Are you sure you want to cancel this ${lastRequest.service} REQUEST. The request is worthy ${currencyFormatter(lastRequest?.offer)}`
                    }
                    dispatch(setConfirmDialog({isVisible: true,text,okayBtn: 'NOT NOW',cancelBtn: 'TERMINATE',severity: true,response: (res:boolean) => {
                      if (!res) {
                        handleCancelRequest(lastRequest?.connectionId);
                      }
                    }}));
                  }}>
                    <Icon type='MaterialIcons' name="cancel" size={36} color={colors.tomato} />
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
            <View style={{flex:1,alignItems:'flex-end'}}>
              <View style={{height:60,width:60,borderRadius:100,overflow:'hidden'}}>
                <LinearGradient colors={["#e44528","#d6a8e7","#f3bf4f"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{width:60,height:60,alignItems:'center',justifyContent:'center'}}>  
                  <TouchableOpacity style={{alignContent:'center',alignItems:'center',justifyContent:'center',backgroundColor:'#fff',height:57,width:57,borderRadius:100,}} onPress={() => {
                    let text = `By Clicking the ARRIVED button you confirm that you have met with your service provider and this request will be marked as in progress`
                    if(!isRequester){
                      text = `By Clicking the ARRIVED button you confirm that you have met with your client and this request will be marked as in progress.\n\nWhen done you can manually go online on your settings tab`
                    }
                    const distance:any =  getDistance(location.latitude, location.longitude, lastRequest.meetUpLocation?.latitude, lastRequest.meetUpLocation?.longitude).toFixed(2)
                    if((distance < 0.) || isRequester){
                      dispatch(setConfirmDialog({isVisible: true,text,okayBtn: 'NOT NOW',cancelBtn: 'ARRIVED',severity: true,response: (res:boolean) => {
                        if (!res) {
                          handleArriveRequest(lastRequest?.connectionId);
                        }
                      }}));
                    }else{
                      showToast("Your claim does not look authentic, please contact us to resolve this issue")
                    }
                  }}>
                    <Icon type='MaterialIcons' name="location-on" size={36} color={colors.green} />
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          </View>
        </Animatable.View>
      }
    </Animatable.View>
  );
};
