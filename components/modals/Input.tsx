import React, { memo, useContext, useEffect, useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { FontAwesome, Feather, AntDesign} from "@expo/vector-icons";
import TextArea from '../ui/TextArea';
import { useDispatch } from 'react-redux';
import { setModalState } from '../../state/slices/modalState';
import { showToast } from '../../helpers/methods';
import useAuth from '../../hooks/useAuth';
interface InputProps {
    attr:{
        handleChange:(field:any,value:string | number) => void;
        field?:string;
        placeholder:string;
        hint?:string;
        isNumeric?:boolean;
        headerText:string;
        value?:any;
        multiline?:boolean;
        isPassword?:boolean;
    }
}
const Input = memo((props:InputProps) => {
    const {handleChange,multiline,field,placeholder,hint,isNumeric,headerText,value:val,isPassword} = props.attr;
    const {accountInfo} = useAuth();
    const bankDetails = [{type:"BANK NAME",value:"FNB"},{type:"ACCOUNT NUMBER",value:"62849814638"},{type:"ACCOUNT HOLDER",value:"EMPIRE DIGITALS"},{type:"REFERENCE",value:accountInfo?.clientId}]
    const dispatch = useDispatch();
    const [value,setValue] = useState<string>('');
    useEffect(() => {
        if(val){
            setValue(val)
        }
    },[])
    return (
        <View>
            <View>
                <View style={{padding:10}}>
                    {hint && <Text style={{fontFamily:'fontLight'}}>{hint}</Text>}
                    {headerText === "ENTER AMOUNT" && 
                        <View>
                            <Text style={{fontFamily:'fontLight',marginBottom:10}}>You can directly transfer to the below account. Once done, send your proof of payment to mjolo@empiredigitals.org or via whatsApp at +27 73 705 5470 0r use the below textBox to make your payment via payFast.</Text>
                            {bankDetails.map((item:any,i:number) => (
                                <View key={item.type + i} style={{flexDirection:'row',borderColor:'#f2eae9',borderBottomWidth:0.8,paddingBottom:5,marginBottom:5}}>
                                    <View style={{width:30}}>
                                        <AntDesign name="Safety" size={20} color="#0e75b4"/>
                                    </View>
                                    <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                                        <Text style={{color:'#2a2828',fontFamily:'fontBold',fontSize:12,paddingLeft:15}}>{item.type}</Text>
                                    </View>
                                    <View style={{flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                                        <Text style={{color:'#2a2828',fontFamily:'fontLight',fontSize:11,paddingLeft:15}}>{item.value}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    }
                    <TextArea attr={{field: !isPassword ? 'value' : 'password',value,icon:{name:'list',type:'MaterialIcons',min:5,color:'#5586cc'},keyboardType:isNumeric ? 'numeric' : 'default',multiline,placeholder,color:'#009387',handleChange:(field,val)=>{setValue(val)}}} />
                    
                    <View style={{alignItems:'center',marginTop:30}}>
                        <TouchableOpacity onPress={()=>{
                            if(value.length > 2 || isNumeric){
                                dispatch(setModalState({isVisible:false}))
                                handleChange(field,value)
                            }else{
                                showToast("Please carefully fill in!")
                            }
                        }}>
                            <FontAwesome name='check-circle' size={120} color="green"></FontAwesome>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
})

export default Input