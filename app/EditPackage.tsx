import React, { useEffect, useState } from "react";
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
import useGames, { items } from "../hooks/useGames";

const Claim = () => {
    const {packageParams}:any = useSearchParams();
    const packageToClaim:GamblingItemsType[] = packageParams && [JSON.parse(packageParams)];
    const [packageInfo,setPackageInfo] = useState<GamblingItemsType>();
    const [isAddItem,setIsAddItem] = useState(false);
    const [newItem, setNewItem] = useState('');
    const {accountInfo,activeUser:activeProfile} = useUsers();
    const {onSend} = useMessages();
    const {location} = useLocation();
    const {getMyWonPackages,savePackage} = useGames();
    const router = useRouter();
    const dispatch = useDispatch();
    const handleChange = (field:string,value:string) => {
        setPackageInfo((v:any) =>({...v, [field] : value}))
    };
    
    const handleAddItem = () => {
        if(newItem.length > 2){
            setPackageInfo((prevPackageInfo:any) => {
                const updatedPackageInfo = { ...prevPackageInfo };
                updatedPackageInfo.items.push(newItem);
                return updatedPackageInfo;
            });
            setNewItem('');
        }else{
            showToast('Please enter a valid item name')
        }
    };
    const handleDeleteItem = (index:number) => {
        setPackageInfo((prevPackageInfo:any) => {
          const updatedPackageInfo = { ...prevPackageInfo };
          updatedPackageInfo.items.splice(index, 1);
          return updatedPackageInfo;
        });
      };
    useEffect(() => {
        setPackageInfo(packageToClaim?.[0])
    },[])
    return (
        <View style={styles.container}>
            <Stack.Screen options={{title:'EDIT PACKAGE', headerTitleStyle:{fontFamily:'fontBold',fontSize:12}}} />
            <StatusBar style='light' />
            <LinearGradient colors={["#fff", "#fff", "#fff", "#f1f7fa"]} style={styles.gradientContainer}>
                <View style={{flexDirection:'row',backgroundColor:"#FFAEA2",padding:5,borderRadius:5,height:50,justifyContent:'center'}}>
                    <View style={{flex:1,justifyContent:'center'}}><Text style={{fontFamily:'fontBold',fontSize:13,color:colors.white}}>{packageInfo?.class}</Text></View>
                    <View style={{justifyContent:'center'}}><Text style={{fontFamily:'fontBold',fontSize:13,color:colors.white}}>EST {currencyFormatter(packageInfo?.totalCost)}</Text></View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <TextArea attr={{field:'description',icon:{name:'list',type:'FontAwesome',min:5,color:'#5586cc'},multiline:true,keyboardType:'default',value:packageInfo?.description,placeholder:'What else would you like us to know?',color:'#009387',handleChange}} />
                    {[packageInfo]?.map((item) =>{
                        return (item?.items?.length || [].length) > 0 ? item?.items?.map((itemDes,itemIndex) =>
                            <View key={itemIndex} style={{flexDirection:'row'}}>
                                <View style={{flex:1}}>
                                    <TextArea attr={{field:'item'+itemIndex,icon:{name:'info',type:'FontAwesome',min:5,color:'#5586cc'},keyboardType:'default',value:itemDes,placeholder:'Enter Item Name',color:'#009387',handleChange:(field,value) => {
                                        setPackageInfo((prevPackageInfo:any) => {
                                            const updatedPackageInfo = { ...prevPackageInfo };
                                            updatedPackageInfo.items[itemIndex] = value;
                                            return updatedPackageInfo;
                                        });
                                    }}} />
                                </View>
                                <TouchableOpacity onPress={() => handleDeleteItem(itemIndex)} style={{justifyContent:'center'}}><Icon type="MaterialIcons" name="delete-forever" size={36} color="tomato" /></TouchableOpacity>
                            </View>
                        ) : <View></View>
                    })}
                    {isAddItem &&
                        <View style={{marginTop:12,alignItems:'center'}}>
                            <TextArea attr={{field:'newItem',icon:{name:'info',type:'FontAwesome',min:5,color:'#5586cc'},keyboardType:'default',value:newItem,placeholder:'Add New Item',color:'#009387',handleChange:(field,value) =>{
                                setNewItem(value)
                            }}} />
                            <View style={{marginTop:24}}>
                                <TouchableOpacity onPress={handleAddItem}><Icon name="check-circle" type="Feather" color="green" size={48} /></TouchableOpacity>
                            </View>
                        </View>
                    }
                    <View style={{marginTop:12,alignItems:'flex-end'}}><TouchableOpacity onPress={() => setIsAddItem(!isAddItem)}><Text style={{textAlign:'right',color:!isAddItem ? 'green' : 'tomato',fontFamily:'fontBold',fontSize:12}}>{!isAddItem ? '+ ADD NEW ITEM' : 'Cancel'}</Text></TouchableOpacity></View>
                    <Text style={{fontFamily:'fontLight',fontSize:12,top:8}}>Total cost of all items</Text>
                    <TextArea attr={{field:'totalCost',icon:{name:'cash',type:'Ionicons',min:5,color:'#5586cc'},keyboardType:'number-pad',value:packageInfo?.totalCost?.toString(),placeholder:'Total Cost',color:'#009387',handleChange}} />
                    <Text style={{fontFamily:'fontLight',fontSize:12,top:8}}>How much is the minimum bet amount for this package?</Text>
                    <TextArea attr={{field:'minBet',icon:{name:'cash',type:'Ionicons',min:5,color:'#5586cc'},keyboardType:'number-pad',placeholder:'min bet amount',color:'#009387',handleChange}} />
                </ScrollView>
                <View style={{padding:30}}>
                    <Button 
                        btnInfo={{styles:{borderRadius:10,borderColor:'#63acfa',width:'100%'}}} 
                        textInfo={{text:'SAVE PACKAGE',color:colors.grey}} 
                        iconInfo={{type:'FontAwesome', name:'save',color:colors.orange,size:16}}
                        handleBtnClick={() => {
                            dispatch(setConfirmDialog({isVisible: true,text:'You are about to save '+packageInfo?.class + ' with the listed items. Press confirm to save',okayBtn: 'CONFIRM',cancelBtn: 'Cancel',severity: true,response: async(res:boolean) => {
                                if (res) {
                                    savePackage(packageInfo as GamblingItemsType)
                                }
                            }}));
                        }}
                    />
                    </View>
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
