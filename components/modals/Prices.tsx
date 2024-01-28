import React, { memo, useEffect, useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { FontAwesome} from "@expo/vector-icons";
import TextArea from '../ui/TextArea';
import { FeesType } from '../../constants/Types';
import { useDispatch } from 'react-redux';
import { setModalState } from '../../state/slices/modalState';
import { showToast } from '../../helpers/methods';
import { Button } from '../ui/Button';
import { colors } from '../../constants/Colors';
type PriceTypeProps = {
    attr:{
        updatePrices:any;
        service:string;
        fees?:any;
    }
}
const Prices = memo((props:PriceTypeProps) => {
    const {updatePrices,service,fees} = props.attr;
    const dispatch = useDispatch();
    const [formData,setFormData] = useState<FeesType[]>([
        {type:'HOURLY',fee:0,name:'HOURS'},
        {type:'DAILY',fee:0,name:'DAYS'},
        {type:'WEEKLY',fee:0,name:'WEEKS'},
        {type:'MONTHLY',fee:0,name:'MONTHS'},
        {type:'YEARLY',fee:0,name:'YEARS'},
    ]);
    const handleChange = (field:string,value:number | any) => {
        setFormData(formData.map(item => item.type === field ? {...item,fee:value} : item))
    };
    useEffect(() => {
        if(fees){setFormData(fees)}
    },[])
    return (
        <View>
            <View>
                <Text style={{fontFamily:'fontBold',color:'#757575',marginLeft:25,marginTop:15}}>SETUP YOUR {service} RATE</Text>
                <View style={{padding:20}}>
                    <Text style={{fontFamily:'fontLight',fontSize:11,top:8}}>Hourly Rate</Text>
                    <TextArea attr={{field:'HOURLY',icon:{name:'money',type:'MaterialIcons',min:5,color:'#5586cc'},value:formData[0].fee.toString(),keyboardType:'numeric',placeholder:'YOUR HOURLY RATE',color:'#009387',handleChange}} />
                    
                    <Text style={{fontFamily:'fontLight',fontSize:11,top:8}}>Daily Rate</Text>
                    <TextArea attr={{field:'DAILY',icon:{name:'money',type:'MaterialIcons',min:5,color:'#5586cc'},value:formData[1].fee.toString(),keyboardType:'numeric',placeholder:'YOUR DAILY RATE',color:'#009387',handleChange}} />
                    
                    <Text style={{fontFamily:'fontLight',fontSize:11,top:8}}>Weekly Rate</Text>
                    <TextArea attr={{field:'WEEKLY',icon:{name:'money',type:'MaterialIcons',min:5,color:'#5586cc'},value:formData[2].fee.toString(),keyboardType:'numeric',placeholder:'YOUR WEEKLY RATE (optional)',color:'#009387',handleChange}} />
                    
                    <Text style={{fontFamily:'fontLight',fontSize:11,top:8}}>Monthly Rate</Text>
                    <TextArea attr={{field:'MONTHLY',icon:{name:'money',type:'MaterialIcons',min:5,color:'#5586cc'},value:formData[3].fee.toString(),keyboardType:'numeric',placeholder:'YOUR MONTHLY RATE (optional)',color:'#009387',handleChange}} />
                    
                    <Text style={{fontFamily:'fontLight',fontSize:11,top:8}}>Yearly Rate</Text>
                    <TextArea attr={{field:'YEARLY',icon:{name:'money',type:'MaterialIcons',min:5,color:'#5586cc'},value:formData[4].fee.toString(),keyboardType:'numeric',placeholder:'YOUR YEARLY RATE (optional)',color:'#009387',handleChange}} />
                    

                    {fees && 
                        <View style={{marginTop:15}}>
                            <Button
                                btnInfo={{styles:{borderRadius:10,borderColor:colors.tomato,width:'100%'}}} 
                                textInfo={{text:'DELETE SERVICE',color:colors.tomato}} 
                                iconInfo={{type:'MaterialIcons', name:'cancel',color:colors.tomato,size:16}}
                                handleBtnClick={()=> {
                                    dispatch(setModalState({isVisible:false}));
                                    updatePrices(service,'DELETE_SERVICE');
                                }}
                            />
                        </View>
                    }
                    <View style={{alignItems:'center',marginTop:30}}>
                        <TouchableOpacity onPress={()=>{
                            if(formData[0].fee && formData[1].fee){
                                dispatch(setModalState({isVisible:false}));
                                updatePrices(service,formData.map(item => item.fee === '' ? {...item,fee:0} : {...item,fee:parseFloat(item.fee.toString())  * 1.15}));
                            }else{
                                showToast("Hourly and Daily rates are required")
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

export default Prices