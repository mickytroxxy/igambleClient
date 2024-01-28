import React, { memo, useContext, useState } from 'react'
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Image } from 'react-native'
import { Ionicons, AntDesign,Feather,FontAwesome } from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from '../../../context/AppContext';
import { styles } from '../../styles';
const Businesses = memo((props) => {
    const {navigation,fontLight} = props?.data;
    const {appState:{businesses,getUserProfile}} = useContext(AppContext);
    const [services,setServices] = useState([
        {type:'AGENTS',selected:true},
        {type:'SAFE HOUSES',selected:false},
        {type:'RIDES',selected:false}
    ])
    const selectedService = services.filter(item => item.selected)[0];
    const selectedBusiness = businesses?.filter(item => item.type === selectedService.type);
    return (
        <Animatable.View animation="bounceIn" duration={1000} useNativeDriver={true} style={{padding:5,borderTopColor:'#ccc',borderTopWidth:0.6 }}>
            {/* <View style={{flexDirection:'row',alignItems:'center',marginTop:10,justifyContent:'space-between',padding:3}}>
                {services.map((item,i) => 
                    <View key={item.type+i} style={{height:50,width:'33%',borderRadius:10,overflow:'hidden'}}>
                        <LinearGradient colors={["#e44528","#d6a8e7","#f3bf4f"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{backgroundColor : !item.selected ? "#fff" : "#0e75b3",width:'100%',borderRadius:10,height:50,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>  
                            <TouchableOpacity onPress={() => setServices(services.map(data => data.type === item.type ? {...data,selected:true} : {...data,selected:false}))}  style={{alignContent:'center',alignItems:'center',justifyContent:'center',backgroundColor:!item.selected ? "#fff" : "#0e75b3",height:47,width:'98%',borderRadius:10}}>
                                <Text style={{fontFamily:fontLight,color:item.selected ? "#fff" : "#0e75b3",fontSize:Platform.OS === 'ios' ? 11 : 9}}>{item.type}</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                )}
            </View> */}
            {selectedBusiness?.length !== 10 && (
                <View style={{alignItems:'center',marginTop:5}}>
                    <Text style={{fontFamily:fontLight,textAlign:'center',fontSize:12}}>Would You Like To Join Mujolo+ As A Service Provider?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("CreateBusiness",selectedService.type.slice(0,selectedService.type.length - 1))}><Ionicons name='add-circle-outline' size={72} color="green" /></TouchableOpacity>
                </View>
            )}
            {selectedBusiness?.length > 10 && (
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {selectedBusiness.map((item, i) => (
                        <TouchableOpacity key={i} onPress={() => {
                            getUserProfile(navigation,'BusinessProfile',item.clientId)
                        }}>
                            <View style={styles.mediaImageContainer}>
                                <Animatable.Image animation="zoomInDown" duration={2000} useNativeDriver={true} source={{uri: item.avatar}} style={styles.image} resizeMode="cover"></Animatable.Image>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </Animatable.View>
    )
})
export default Businesses