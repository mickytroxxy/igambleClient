import 'react-native-gesture-handler';
import { Text, View, StyleSheet, Dimensions, ScrollView,TouchableOpacity, Platform } from 'react-native';
import { Ionicons, MaterialIcons,FontAwesome, Foundation } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { memo, useState } from 'react';
import Constants from 'expo-constants'
import { StatusBar } from 'expo-status-bar';
import { colors } from '../../constants/Colors';
import { Button } from '../ui/Button';

const Filter = () =>{
    const accountInfo = useSelector((state: RootState) => state.accountInfo);
    const requestPreference = [
        {category:'ANY',selected:true},
        {category:'MASSAGE',selected:false},
        {category:'DINNER MATE',selected:false},
        {category:'DRINK MATE',selected:false},
        {category:'FAKE PARTNER',selected:false},
        {category:'DANCER',selected:false},
        {category:'DRIVER',selected:false},
        {category:'PVT SECURITY',selected:false}
    ]
    const gamePreference = [
        {category:'DICE',selected:true},
        {category:'WHEEL OF FORTUNE',selected:false},
        {category:'POKER',selected:false},
    ]
    const [preferenceTypes,setPreferenceTypes] = useState(requestPreference)

    const [mainCategories,setMainCategories] = useState([{category:'REQUEST',selected:true},{category:'PLAY & WIN',selected:false}])
    const mainCategory = mainCategories.filter(item => item.selected === true)[0].category;
    return(
        <View style={{position:'absolute',width:'100%',zIndex:1000,padding:10,top: Constants.statusBarHeight}}>
            <View style={Platform.OS === 'ios' ? styles.interestViewIos : styles.interestView}>
                <LinearGradient colors={["#f9f1ed","#f3f9fe","#faf8fa","#f7f3d0"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{backgroundColor:'#f9f1ed',justifyContent:'center',padding:5,borderTopLeftRadius:10,borderTopRightRadius:10}}>
                    <View style={{width:'100%',flexDirection:'row',justifyContent:'space-around'}}>
                        {mainCategories.map((item,i) =>
                            <View style={{flex:1}} key={i}>
                                <Button 
                                    btnInfo={{styles:{borderRadius:5,borderColor:colors.orange,width:'99%',backgroundColor:item.selected ? '#F9B030' : colors.white,padding:5}}} 
                                    textInfo={{text:item.category,color: !item.selected ? '#F9B030' : colors.white}} 
                                    iconInfo={{type: item.category === 'REQUEST' ? 'MaterialIcons' : 'Foundation', name: item.category === 'PLAY & WIN' ? 'social-game-center' : 'location-history',color:!item.selected ? '#F9B030' : colors.white,size:30}}
                                    handleBtnClick={() => {
                                        setMainCategories(mainCategories.map(data => data.category === item.category ? {...data,selected:true} : {...data,selected:false}))
                                        if(item.category === "REQUEST"){
                                            setPreferenceTypes(requestPreference)
                                        }else{
                                            setPreferenceTypes(gamePreference)
                                        }
                                    }}
                                />
                            </View>
                        )}
                    </View>
                </LinearGradient>
                <View style={{flexDirection:'row'}}>
                    <View style={{width:50,backgroundColor:'#fff',justifyContent:'center',alignContent:'center',alignItems:'center',borderRadius:10}}>
                        <TouchableOpacity onPress={() => {}}>
                            <FontAwesome name="user-o" size={30} color="#63acfa" alignSelf="center"/>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1,padding:10}}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                               preferenceTypes.map((item,i)=>(
                                    <View key={i} style={{height:40,width:190,borderRadius:5,overflow:'hidden',marginRight:10}}>
                                        <LinearGradient colors={["#e44528","#63acfa","#f3bf4f"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{width:190,height:40,alignItems:'center',justifyContent:'center'}}>  
                                            <TouchableOpacity onPress={() => {
                                                setPreferenceTypes(preferenceTypes.map(data => data.category === item.category ? {...data,selected:true} : {...data,selected:false}))
                                            }} style={{alignContent:'center',alignItems:'center',justifyContent:'center',backgroundColor:item.selected ? '#FECE79' : '#fff',height:38,width:188,borderRadius:5,display:'flex',flexDirection:'row'}}>
                                                {mainCategory === 'REQUEST' && <FontAwesome name="heart" size={18} color={item.selected ? "#fff" : "#f9896d"} />}
                                                {mainCategory === 'PLAY & WIN' && <Foundation name="social-game-center" size={24} color={item.selected ? "#fff" : "#63acfa"} />}
                                                <Text style={{fontFamily:'fontBold',color:item.selected ? "#fff" : "#757575"}}> {item.category}</Text>
                                            </TouchableOpacity>
                                        </LinearGradient>
                                    </View>
                                ))
                            }
                        </ScrollView>
                    </View>
                </View>
            </View>
        </View>
    )
};
const styles = StyleSheet.create({
    interestView:{
        backgroundColor: '#fff',
        borderRadius:10,
        shadowColor: "#000",
        shadowOffset: {
          width: 10,
          height: 10,
        },
        shadowOpacity: 1,
        shadowRadius: 3.84,
        elevation: Platform.OS === 'ios' ? 0 : 30,
    },
    interestViewIos:{
        backgroundColor: '#fff',
        borderRadius:10,
        borderColor:'#F9B030',
        borderWidth:1
        
    },
    interestListItem:{
        justifyContent:'center',alignContent:'center',
        alignItems:'center',marginLeft:10,marginRight:10,
        padding:7,backgroundColor:'pink',
        borderRadius:30,display:'flex',flexDirection:'row'
    },
    lowerInterestList:{
        height:10,
        width:'100%',borderTopRightRadius:30,
        borderTopLeftRadius:30,

        borderTopWidth:0.5,
        borderRightWidth:0.7,
        borderLeftWidth:0.7,
        borderTopColor:'#dcdbd8',
        borderLeftColor:'#dcdbd8',
        borderRightColor:'#dcdbd8',
    }
});
export default memo(Filter);
