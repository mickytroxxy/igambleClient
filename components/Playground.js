import { View, Text } from 'react-native'
import React, { useEffect } from 'react'

export default function Playground() {
    useEffect(() => {
        (()=>{
            const str = "emocleW ot eht !avivmoC"
            const arrayString = str.split(" ");
            const reversedStr1  = arrayString.map((item) => item.split("").reverse().join("")).join(" ")
            const reversedStr2 = str.split('').reverse().join('').split(" ").reverse().join(" ");
            console.log((reversedStr1))
        })()
    },[])
    return (
        <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
            <Text>Playground</Text>
        </View>
    )
}