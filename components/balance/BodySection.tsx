import { ScrollView, TouchableOpacity, View, Text, TouchableHighlight, Platform } from "react-native";
import { colors } from "../../constants/Colors";
import { LinearGradient } from 'expo-linear-gradient';
import TextArea from "../ui/TextArea";
import { useRouter } from "expo-router";
import CountrySelector from "../ui/CountrySelector";
import { Button } from "../ui/Button";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { getTransactions } from "../../helpers/api";
import { AntDesign } from "@expo/vector-icons";
import { currencyFormatter } from "../../helpers/methods";
import Icon from "../ui/Icon";
import usePayment from "../../hooks/usePayment";
export const BodySection = () =>{
    const navigation = useRouter();
    const {accountInfo} = useAuth();
    const {showAmountModal,showWithdrawalModal} = usePayment();
    const [transactions,setTransactions] = useState<any[]>([]);
    useEffect(() => {
        (async() => {
            try {
                const response = await getTransactions(accountInfo?.clientId);
                setTransactions(response);
            } catch (error) {
                console.log(error)
            }
        })()
    },[])
    return(
      <View style={{padding:10,flex: 1,marginTop:5,borderRadius:10}}>
        <LinearGradient colors={["#fff","#e8e9f5","#fff","#F6BDA7"]} style={{flex:1,paddingTop:10,borderRadius:10}}>
            <ScrollView style={{padding:10}}>
                <View style={{alignContent:'center',alignItems:'center',marginTop:-10}}>
                    <TouchableHighlight style={{alignSelf:'center',backgroundColor:'#fff',height:30,elevation:0}} >
                        <Icon type="FontAwesome" name="ellipsis-h" color="#757575" size={30} />
                    </TouchableHighlight>
                </View>
                <View style={{marginBottom:15,flexDirection:'row'}}>
                    <View style={{flex:1,padding:5}}>
                        <Button 
                            btnInfo={{styles:{borderRadius:10,borderColor:colors.green,width:'100%'}}} 
                            textInfo={{text:'LOAD ACCOUNT',color:colors.green}} 
                            iconInfo={{type:'AntDesign', name:'pluscircleo',color:colors.green,size:16}}
                            handleBtnClick={()=>{
                                showAmountModal();
                            }}
                        />
                    </View>
                    <View style={{flex:1,padding:5}}>
                        <Button 
                            btnInfo={{styles:{borderRadius:10,borderColor:colors.tomato,width:'100%'}}} 
                            textInfo={{text:'WITHDRAW FUNDS',color:colors.tomato}} 
                            iconInfo={{type:'AntDesign', name:'minuscircleo',color:colors.tomato,size:16}}
                            handleBtnClick={()=>{
                                showWithdrawalModal()
                            }}
                        />
                    </View>
                </View>
                {transactions?.length > 0 && transactions?.sort((a,b)=>b.date - a.date).map((item:any,i:number) => {
                    const user = item.fromUser === accountInfo?.clientId ? item.toUser : item.fromUser;
                    const isAdd = item.toUser === accountInfo?.clientId
                    return(
                        <View key={item.type + i} style={{flexDirection:'row',borderColor:'#f2eae9',borderBottomWidth:0.8,paddingBottom:5,marginBottom:5}}>
                            <View style={{width:24}}>
                                <AntDesign name={isAdd ? "pluscircleo" : "minuscircleo"} size={20} color={isAdd ? colors.green : colors.tomato}/>
                            </View>
                            <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                                <Text style={{color:'#2a2828',fontFamily:'fontBold',fontSize:Platform.OS === 'android' ? 10 : 12,paddingLeft:15}}>{item.category} - {user}</Text>
                            </View>
                            <View style={{flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                                <Text style={{color:isAdd ? colors.green : colors.tomato,fontFamily:'fontLight',fontSize:11,paddingLeft:15}}>{isAdd ? "+" : "-"}{currencyFormatter(item.amount)}</Text>
                            </View>
                        </View>
                    )
                })}
            </ScrollView>
        </LinearGradient>
      </View>
    )
};