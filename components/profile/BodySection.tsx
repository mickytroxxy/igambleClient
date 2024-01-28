import {TouchableOpacity, View, Text, StyleSheet, Clipboard} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from "expo-router";
import Icon from "../ui/Icon";
import { useDispatch } from "react-redux";
import useUsers from "../../hooks/useUsers";
import { FontAwesome } from "@expo/vector-icons";
import Stats from "./components/Stats";
import { colors } from "../../constants/Colors";
import useAuth from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import { useEffect, useState } from "react";
import { setModalState } from "../../state/slices/modalState";
import { currencyFormatter, showToast } from "../../helpers/methods";
import { createData, getTokens } from "../../helpers/api";
import useGames from "../../hooks/useGames";
export type TokenTypes = {
    accountId:string;
    currentAmount: number;
    purchaseValue:number;
    token: string;
    timeStamp:number;
}
export const BodySection = () =>{
    const navigation = useRouter();
    const dispatch = useDispatch();
    const {activeUser:activeProfile,accountInfo} = useUsers();
    const {items} = useGames();
    const [tokens,setTokens] = useState<TokenTypes[]>([]);
    const [balanceBtns,setBalanceBtns] = useState([{type:'PROFIT',selected:true},{type:'LOSS',selected:false}])
    const balanceBtn = balanceBtns.filter(item => item.selected === true)[0].type as 'PROFIT' | 'LOSS'
    const {logOut} = useAuth();
    const handleGenerateToken = () => {
        dispatch(setModalState({isVisible:true,attr:{headerText:'GENERATE TOKEN',isNumeric:true,field:'reports',placeholder:'Enter Amount greater than R4.99',handleChange:async(field:string,value:string)=>{
            if(parseFloat(value) >= 5){
                const token = Math.floor(Math.random()*89999999+10000000).toString(); 
                const response = await createData('tokens',token,{accountId:accountInfo?.clientId,token,purchaseValue:parseFloat(value),currentAmount:parseFloat(value), timeStamp:Date.now()} as TokenTypes);
                if(response){
                    showToast("You have successfully generated a token");
                    getTokenFn();
                }else{
                    showToast("Oops, Something went wrong, please try again!")
                }
            }else{
                showToast("Enter Amount Greater Than R4.99")
            }
            // let currentData:any = [...activeProfile?.reports||[]];
            // currentData = [...currentData,{clientId:accountInfo?.clientId,issue:value,date:Date.now()}];
            
        }}}))
    }
    const getTokenFn = async () => {
        const response = await getTokens(accountInfo?.clientId);
        setTokens(response);
        console.log(response)
    }
    useEffect(() => {
        getTokenFn();
    },[])
    return(
        <View style={{flex: 1,marginTop:5,borderRadius:10}}>
             <Stack.Screen options={{ 
                headerRight: () => (<TouchableOpacity onPress={logOut} style={{}}><Icon type="FontAwesome" name="sign-out" size={40} color={colors.tomato} /></TouchableOpacity>)
            }} />
            <LinearGradient colors={["#fff","#e8e9f5","#fff","#F6BDA7"]} style={styles.footerStyle}>
                <View style={styles.ProfileFooterHeader}>
                    <View style={{alignContent:'center',alignItems:'center',marginTop:-10}}>
                        <FontAwesome name="ellipsis-h" color="#63acfa" size={36}></FontAwesome>
                    </View>
                    {/* <Stats data={{activeProfile,profileOwner}} /> */}
                    <View style={{flexDirection:'row',justifyContent:'space-around',paddingBottom:20}}>
                        {balanceBtns.map((btn,i) => 
                            <View style={{width:'49%'}} key={btn.type}>
                                <Button 
                                    btnInfo={{styles:{borderRadius:10,borderColor:'#63acfa',backgroundColor:btn.selected ? '#63acfa' : colors.white,width:'100%'}}} 
                                    textInfo={{text:btn.type,color: btn.selected ? colors.white : '#63acfa'}} 
                                    iconInfo={{type:'FontAwesome5', name: btn.type === 'CARD PAYMENT' ? 'money-check' : 'money-bill-wave',color: btn.selected ?  colors.white : '#63acfa',size:16}}
                                    handleBtnClick={() => setBalanceBtns(balanceBtns.map(data => data.type === btn.type ? {...data,selected:true} : {...data,selected:false}))}
                                />
                            </View>
                        )}
                    </View>
                </View>
                <View style={{flexDirection:'row',marginTop:20}}>
                    <View style={{flex:1}}><Text style={{fontFamily:'fontBold',color:balanceBtn === 'PROFIT' ? 'green' : 'tomato'}}>R 253 00.56</Text></View>
                    <View><Text style={{fontFamily:'fontBold',color:'#757575'}}>{balanceBtn}</Text></View>
                </View>
                <View style={{marginTop:12}}>
                    <Button 
                        btnInfo={{styles:{borderRadius:10,borderColor:'#63acfa',backgroundColor: colors.white,width:'100%'}}} 
                        textInfo={{text:'GENERATE TOKEN',color: '#63acfa'}} 
                        iconInfo={{type:'FontAwesome5', name: 'money-bill-wave',color: '#63acfa',size:16}}
                        handleBtnClick={() => {handleGenerateToken()}}
                    />
                </View>
                <View style={{flexDirection:'row',marginTop:20,marginBottom:20}}>
                    <View style={{flex:1}}><Text style={{fontFamily:'fontBold',color: '#63acfa'}}>RECENT TOKENS</Text></View>
                    <View><Text style={{fontFamily:'fontLight',color:'blue',fontSize:11}}>VIEW ALL</Text></View>
                </View>
                {(tokens && tokens.length > 0) && tokens.sort((a, b) => new Date(b?.timeStamp) - new Date(a?.timeStamp)).slice(0,5).map((item,i) => 
                    <View key={i} style={{flexDirection:'row',marginTop:5,backgroundColor:'#fff', padding:15,borderRadius:10}}>
                        <TouchableOpacity style={{flex:1,flexDirection:'row'}} onPress={() => {
                            Clipboard.setString(item.token);
                            showToast("Token copied!")
                        }}>
                            <View style={{justifyContent:'center'}}><Text style={{fontFamily:'fontBold',color: '#63acfa'}}>{item.token} </Text></View>
                            <Icon name="copy" color="#757575" type="Feather" size={18} />
                        </TouchableOpacity>
                        <View><Text style={{fontFamily:'fontLight',color:'#757575',fontSize:13}}>{item.currentAmount} <Text style={{fontFamily:'fontLight',color:'green',fontSize:11}}>{item.purchaseValue}</Text></Text></View>
                    </View>
                )}
                <View style={{marginTop:24,backgroundColor:'white',padding:10}}>
                    {items?.map((item, i) => {
                        return(
                            <TouchableOpacity onPress={() => navigation.push({pathname:'EditPackage',params:{packageParams:JSON.stringify(item)}})} key={item.id * i} style={{marginBottom:15,backgroundColor:colors.faintGray,borderRadius:5,padding:10}}>
                                <View style={{flexDirection:'row',margin:5,backgroundColor:"#FFAEA2",padding:5,borderRadius:5,height:50,justifyContent:'center'}}>
                                    <View style={{flex:1,justifyContent:'center'}}><Text style={{fontFamily:'fontBold',fontSize:13,color:colors.white}}>{item.class}</Text></View>
                                    <View style={{justifyContent:'center'}}><Text style={{fontFamily:'fontBold',fontSize:13,color:colors.white}}>EST {currencyFormatter(item.totalCost)}</Text></View>
                                </View>
                                {item?.items?.map((innerItem) => 
                                    <View key={innerItem} style={{flexDirection:'row',padding:5}}>
                                        <View style={{flex:1}}><Icon type='MaterialIcons' name="check-circle" size={16} color={colors.green} /></View>
                                        <View><Text style={{fontFamily:'fontBold',fontSize:11}}>{innerItem}</Text></View>
                                    </View>
                                )}
                                <View style={{padding:5,backgroundColor:colors.white,borderRadius:5}}>
                                    <Text style={{fontFamily:'fontLight',fontSize:12}}>{item.description}</Text>
                                </View>
                                
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </LinearGradient>
        </View>
    )
};
export const styles = StyleSheet.create({
    footerStyle: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        elevation: 10,
        paddingBottom:30,
        marginTop:-70
    },
    ProfileFooterHeader:{
        backgroundColor:'#fff',borderTopLeftRadius: 30, borderTopRightRadius: 30,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 1,
        borderBottomWidth:1,
        borderBottomColor:'#63acfa'
    },
});