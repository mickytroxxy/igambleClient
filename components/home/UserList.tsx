import { View, Text, TouchableOpacity, Image, ScrollView, Platform } from 'react-native'
import React, { useState } from 'react'
import useUsers from '../../hooks/useUsers'
import { setAccountInfo } from '../../state/slices/accountInfo'
import { useDispatch } from 'react-redux'
import { useRouter } from 'expo-router'
import { colors } from '../../constants/Colors'
import { setActiveUser } from '../../state/slices/users'
import { getDistance } from '../../helpers/methods'
import Icon from '../ui/Icon'
import { Button } from '../ui/Button'
import { setModalState } from '../../state/slices/modalState'
type Props = {
    from:string
}
type GenderType = {
    selected:boolean,
    name?:"FEMALE" | "MALE" | "ANY",
    type:"LADIES" | "GENTLEMEN" | "ANY"
}
let pageItems = 15;
export default function UserList(props:Props) {
    const {from} = props;
    const {users,usersError,accountInfo,location,getServiceProviders} = useUsers();
    const [pageIndex,setPageIndex] = useState({startAt:0,endAt:pageItems})

    const [gender,setGender] = useState<GenderType[]>([{selected:false,type:'GENTLEMEN',name:'MALE'},{selected:true,name:"ANY",type:'ANY'},{selected:false,type:'LADIES',name:"FEMALE"}]);
    const dispatch = useDispatch();
    const router = useRouter();

    const handlePagination = (direction:string)=>{
        const {endAt,startAt} = pageIndex;
        if(direction === "next"){
          if(users?.length > pageIndex.endAt){
            setPageIndex({startAt:startAt + pageItems, endAt:endAt + pageItems})
          }
        }else{
          if(pageIndex.endAt > pageItems){
            setPageIndex({startAt:startAt - pageItems, endAt:endAt - pageItems})
          }
        }
    }
    return (
        <View style={{marginTop:5}}>
            <View style={{flexDirection:'row',marginBottom:10,backgroundColor:'#F9F7F6',padding:10,borderRadius:30}}>
                {gender.map((item,i) => 
                    <TouchableOpacity
                        style={{flex:1,flexDirection:'row'}} key={item.type}
                        onPress={()=> setGender(gender.map(data => data.type === item.type ? {...data,selected:true} : {...data,selected:false}))}
                    >
                        <View style={{justifyContent:'center',flex:1}}><Text style={{fontFamily:'fontBold',textAlign:i === 0 ? 'left' : (i === 1 ? 'center' : 'right'),color:item.selected ? '#63acfa' : colors.grey,fontSize:11}}>{item.type}</Text></View>
                        <View style={{justifyContent:'center', marginLeft:5}}><Icon type='Ionicons' size={18} color={item.selected ? 'green' : colors.grey} name='checkmark-done-circle-outline' /></View>
                    </TouchableOpacity>
                )}
            </View>
            {!usersError && users.slice(pageIndex.startAt,pageIndex.endAt)?.map((client, i) => {
                const selectedGender = gender.filter(item => item.selected)[0]
                if(client.clientId !== accountInfo?.clientId){
                    if(selectedGender.name === client.gender || selectedGender.type === 'ANY'){
                        return(
                            <View key={i} style={{flexDirection:'row',paddingBottom:10,marginBottom:10,borderBottomColor:'#D6D8D8',borderBottomWidth:0.7}}>
                                <TouchableOpacity onPress={() => {
                                    dispatch(setActiveUser(client));
                                    router.push("Profile");
                                    dispatch(setModalState({isVisible:false}));
                                }} style={{backgroundColor:colors.orange,borderRadius:10,padding:2}}>
                                    <Image source={{uri: client.avatar !== "" ? client.avatar:'https://picsum.photos/400/400'}} style={{width:120,height:120,borderRadius:10}}/>
                                </TouchableOpacity>
                                <View style={{marginLeft:10,flex:1,justifyContent:'center',marginTop:3}}>
                                    <TouchableOpacity onPress={() => {
                                        dispatch(setActiveUser(client));
                                        router.push("Profile");
                                        dispatch(setModalState({isVisible:false}));
                                    }}>
                                        <Text style={{fontFamily:'fontBold'}}>{client.fname}</Text>
                                        <Text style={{color:'#2a2828',fontFamily:'fontLight',marginTop:5}}>{getDistance(location.latitude, location.longitude, client.address?.latitude, client.address?.longitude).toFixed(2)}km</Text>
                                        {from === "main" && <Text style={{fontFamily:'fontBold',marginTop:5,fontSize:Platform.OS === 'android' ? 12 : 14}}>SERVICES</Text>}
                                    </TouchableOpacity>
                                    {from === "claim" &&
                                        <Button 
                                            btnInfo={{styles:{borderRadius:10,borderColor:'#63acfa',width:'100%'}}} 
                                            textInfo={{text:'CLAIM SERVICE PROVIDER',color:colors.grey}} 
                                            iconInfo={{type:'FontAwesome', name:'heart',color:colors.orange,size:16}}
                                            handleBtnClick={() => {
                                                dispatch(setActiveUser(client));
                                                dispatch(setModalState({isVisible:false}));
                                            }}
                                        />
                                    }
                                    {from === "main" &&
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop:10}}>
                                            {client?.services?.map((item,i) => 
                                                <View key={item.type+i} style={{borderColor:'#63acfa',borderWidth:1,borderRadius:10,padding:10,marginRight:5,paddingRight:10,height:40}}>
                                                    <Text style={{fontFamily:'fontBold',fontSize:Platform.OS === 'android' ? 10 : 13}}>{item.type} {item.fees[0].fee}</Text>
                                                </View>
                                            )}
                                        </ScrollView>
                                    }
                                </View>
                            </View>
                        )
                    }
                }
            })}
            {!usersError && 
                <View style={{alignContent:'center',alignItems:'center',height:50,flexDirection:'row'}}>
                    <View style={{alignContent:'center',alignItems:'center',flex:1}}>
                        <TouchableOpacity onPress={()=>{handlePagination("prev")}} style={{alignContent:'center',alignItems:'center'}}>
                            <Icon name='arrow-circle-left' type='FontAwesome' color={colors.grey} size={36} />
                        </TouchableOpacity>
                    </View>
                    <View style={{alignContent:'center',alignItems:'center',flex:1}}>
                        <TouchableOpacity onPress={()=>{handlePagination("next")}} style={{alignContent:'center',alignItems:'center'}}>
                            <Icon name='arrow-circle-right' type='FontAwesome' color={colors.grey} size={36} />
                        </TouchableOpacity>
                    </View>
                </View>
            }
            {usersError &&
                <View style={{flex:1,alignContent:'center',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontFamily:'fontBold',fontSize:12,color:'#05375a',marginTop:10,textAlign:'center'}}>{usersError}</Text>
                    <TouchableOpacity onPress={() => getServiceProviders(location.latitude,location.longitude,200)} style={{alignContent:'center',alignItems:'center',justifyContent:'center',marginTop:10}}>
                        <Icon type="FontAwesome" name="repeat" size={36} color="#757575" />
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}