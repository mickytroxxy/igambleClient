import { ScrollView, TouchableOpacity, View, Text } from "react-native";
import { colors } from "../../constants/Colors";
import { LinearGradient } from 'expo-linear-gradient';
import TextArea from "../ui/TextArea";
import { RadioButton } from 'react-native-paper';
import { useRouter } from "expo-router";
import CountrySelector from "../ui/CountrySelector";
import { Button } from "../ui/Button";
import useAuth from "../../hooks/useAuth";
import Icon from "../ui/Icon";
export const RegisterBodySection = () =>{
    const navigation = useRouter();
    const {handleChange,register,formData} = useAuth();
    
    return(
      <View style={{padding:10,flex: 1,marginTop:5,borderRadius:10}}>
        <LinearGradient colors={["#fff","#e8e9f5","#fff","#F6BDA7"]} style={{flex:1,paddingTop:10,borderRadius:10}}>
            <ScrollView style={{padding:10}}> 
                <CountrySelector/>

                <TextArea attr={{field:'phoneNumber',icon:{name:'phone',type:'FontAwesome',min:5,color:'#5586cc'},keyboardType:'phone-pad',placeholder:'ENTER YOUR PHONENUMBER',color:'#009387',handleChange}} />
                <TextArea attr={{field:'fname',icon:{name:'user',type:'Feather',min:5,color:'#5586cc'},keyboardType:'default',placeholder:'Company Name',color:'#009387',handleChange}} />
                <TextArea attr={{field:'password',icon:{name:'lock',type:'Feather',color:'#5586cc',min:6},keyboardType:'default',placeholder:'ENTER YOUR PASSWORD',color:'#009387',handleChange}} />
            

                <View style={{marginTop:15,alignItems:'center'}}>
                    <Button 
                        btnInfo={{styles:{borderRadius:10,borderColor:colors.green,width:'50%'}}} 
                        textInfo={{text:'CREATE AN ACCOUNT',color:colors.green}} 
                        iconInfo={{type:'MaterialIcons', name:'lock',color:colors.green,size:16}}
                        handleBtnClick={register}
                    />
                    <TouchableOpacity style={{marginTop:15}} onPress={()=>navigation.back()}><Text style={{fontFamily:'fontBold',textAlign:'center',color:'#757575'}}>Have an account? Login Now</Text></TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
      </View>
    )
};