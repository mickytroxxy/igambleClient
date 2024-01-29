import {TouchableOpacity, View, Text, StyleSheet, TouchableHighlight, Platform } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import Icon from "../ui/Icon";
import { LocationType } from "../../constants/Types";
import useUsers from "../../hooks/useUsers";
import { AddressButton } from "../ui/Button";
import UserList from "./UserList";
import { setModalState } from "../../state/slices/modalState";
import { useDispatch } from "react-redux";
import { getTokenById } from "../../helpers/api";
import { showToast } from "../../helpers/methods";
import { setCurrentToken } from "../../state/slices/game";
import { setIsPlaying, setSound } from "../../state/slices/music";
export const BodySection = () =>{
    const router = useRouter();
    const dispatch = useDispatch();
    const {accountInfo} = useUsers();
    const handleBtnClick = async(value:any, screen:string) => {
        const response = await getTokenById(accountInfo?.clientId, value);
        if(response?.length > 0){
            dispatch(setCurrentToken(response?.[0]));
            dispatch(setSound(null));
            dispatch(setIsPlaying({state:false,trackId:null,isPreview:false}))
            router.push(screen);
        }else{
            showToast('Token Not Found!')
        }
    };
    return(
        <LinearGradient colors={["#fff","#e8e9f5","#000"]} style={styles.footerStyle}>
            <View style={{alignContent:'center',alignItems:'center',marginTop:-10}}>
                <TouchableHighlight style={{alignSelf:'center',backgroundColor:'#fff',height:30,elevation:0}} >
                    <Icon type="FontAwesome" name="ellipsis-h" color="#757575" size={30} />
                </TouchableHighlight>
            </View>
            <View style={{padding:5}}>
                <Text style={{fontFamily:'fontBold',fontSize:15,color:'#353434',textAlign:'center'}}>Click The Start Button To Enter Your Token. You Can Gamble Or Play Music With The Same Token</Text>
            </View>
            <View style={{alignItems:'center',marginTop:30,flexDirection:'row',alignSelf:'center'}}>
                <TouchableOpacity onPress={() => {
                    dispatch(setModalState({isVisible:true,attr:{headerText:'ENTER TOKEN',isNumeric:true,field:'reports',placeholder:'Enter your token number',handleChange:async(field:string,value:string)=>{
                        handleBtnClick(value,"Game")
                    }}}))
                }}><Icon type="MaterialCommunityIcons" name="cards-outline" color="green" size={120} /></TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    dispatch(setModalState({isVisible:true,attr:{headerText:'ENTER TOKEN',isNumeric:true,field:'reports',placeholder:'Enter your token number',handleChange:async(field:string,value:string)=>{
                        handleBtnClick(value,"Artists")
                    }}}))
                }}><Icon type="Ionicons" name="musical-notes-outline" color="green" size={120} /></TouchableOpacity>
            </View>
        </LinearGradient>
    )
};
export const styles = StyleSheet.create({
    footerStyle: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        padding: 10,
        borderTopRightRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        marginTop:-30,
        shadowOpacity: 0.1,
        elevation: 10,
        paddingBottom:30
    },
});