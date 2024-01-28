import React, { memo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { SvgUri } from 'react-native-svg';
import useLocation from '../../hooks/useLocation'
import { countries } from '../../constants/countries';
import { useDispatch } from 'react-redux';
import { setCountryData } from '../../state/slices/location';
import { useRouter } from 'expo-router';
const CountrySelector = memo(() => {
    const {locationWithText, countryData} = useLocation();
    const router = useRouter();
    const dispatch = useDispatch();
    React.useEffect(()=>{
        const {short_name,long_name} = locationWithText;
        if(short_name && long_name){
            dispatch(setCountryData(countries.filter(country => country.name === long_name || country.isoCode === short_name)[0]))
        }
    },[])
    return (
        <View>
            <TouchableOpacity onPress={()=>{
                router.push({pathname:'modal',params:{headerText:'SELECT COUNTRY'}})
            }} style={{padding:12,borderRadius:10,flexDirection:'row',borderColor:'#a8a6a5',borderWidth:1}}>
                <SvgUri
                    width={20}
                    height={18}
                    uri={countryData?.flag}
                />
                <Text style={{flex:1,marginLeft:10,fontFamily:'fontBold',bottom:2}}>{countryData?.dialCode}</Text>
                <Text style={{fontFamily:'fontLight',bottom:2}}>{countryData?.name.slice(0,36)}</Text>
            </TouchableOpacity>
        </View>
    )
})


export default CountrySelector