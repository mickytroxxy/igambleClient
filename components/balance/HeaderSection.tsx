import { Text, View } from "react-native"
import { memo } from "react"
import { LinearGradient } from "expo-linear-gradient"
import Icon from "../ui/Icon"
import { colors } from "../../constants/Colors"
import useUsers from "../../hooks/useUsers"
import { currencyFormatter } from "../../helpers/methods"

export const HeaderSection = memo(() =>{
    const {activeUser:{balance}} = useUsers();
    return(
        <View style={{alignItems:'center',marginTop:30,padding:30}}>
            <LinearGradient style={{flexDirection:'row',width:'100%',padding:10,height:120,justifyContent:'center',borderRadius:50,borderBottomRightRadius:0}} colors={["#FFAEA2",colors.grey,"#FFAEA2"]}start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
                <View style={{flex:1,justifyContent:'center'}}><Text style={{fontFamily:'fontBold',color:colors.white,fontSize:20}}>{currencyFormatter(balance)}</Text></View>
                <View style={{justifyContent:'center'}}><Icon name='wallet-outline' type='Ionicons' size={36} color={colors.white} /></View>
            </LinearGradient>
        </View>
    )
})