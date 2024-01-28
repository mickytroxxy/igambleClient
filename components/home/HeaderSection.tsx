import { Image, View } from "react-native"
import { memo } from "react"

export const HeaderSection = memo(() =>{
    return(
        <View style={{alignItems:'center',marginTop:30}}>
            <Image source={require('../../assets/images/heartios.png')} style={{width:220,height:220,borderRadius:300}}/>
        </View>
    )
})