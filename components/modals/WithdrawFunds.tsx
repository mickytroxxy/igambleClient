import React, { memo, useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import Icon from '../ui/Icon';
import { colors } from '../../constants/Colors';
import TextArea from '../ui/TextArea';
import { showToast } from '../../helpers/methods';
import { Button } from '../ui/Button';
import { getWithdrawals } from '../../helpers/api';
import useAuth from '../../hooks/useAuth';
import { WithDrawalType } from '../../constants/Types';
import { setModalState } from '../../state/slices/modalState';
import { useDispatch } from 'react-redux';
type PriceTypeProps = {
    attr:{
        handleChange:(formData:any) => void;
    }
}
const WithdrawFunds = memo((props:PriceTypeProps) => {
    const {handleChange:cb} = props.attr;
    const {accountInfo} = useAuth();
    const dispatch = useDispatch();
    const [formData,setFormData] = useState<WithDrawalType>({amount:0,bankName:'',accountName:'',accountNumber:'',branchCode:'',accountType:'CHEQUE'});
    const handleChange = (field:string,value:string) => setFormData(v =>({...v, [field] : value}));
    const handleBtnClick = () => {
        if(formData.accountNumber.length > 6 && formData.bankName !== "" && formData.amount > 0 && formData.accountName !== ""){
            dispatch(setModalState({isVisible:false}));
            setTimeout(() => {
                cb(formData);
            }, 200);
        }else{
            showToast("Please fill in carefully before proceeding...")
        }
    }
    useEffect(() => {
        (async() => {
            try {
                const response = await getWithdrawals(accountInfo?.clientId);
                if(response.length > 0){
                    setFormData(response[response.length - 1])
                }
            } catch (error) {
                console.log(error)
            }
        })()
    },[])
    return (
        <View style={{flex:1,padding:15}}>
            <TextArea attr={{field:'amount',value:formData.amount.toString(),icon:{name:'monetization-on',type:'MaterialIcons',min:5,color:'#5586cc'},keyboardType:'numeric',placeholder:'Enter withdrawal amount',color:'#009387',handleChange}} />
            <TextArea attr={{field:'bankName',value:formData.bankName.toString(),icon:{name:'bank',type:'AntDesign',min:5,color:'#5586cc'},keyboardType:'default',placeholder:'Enter bank name',color:'#009387',handleChange}} />
            <TextArea attr={{field:'accountNumber',value:formData.accountNumber.toString(),icon:{name:'confirmation-number',type:'MaterialIcons',min:5,color:'#5586cc'},keyboardType:'numeric',placeholder:'Enter account number',color:'#009387',handleChange}} />
            <TextArea attr={{field:'accountName',value:formData.accountName.toString(),icon:{name:'list',type:'MaterialIcons',min:5,color:'#5586cc'},keyboardType:'default',placeholder:'Enter account name',color:'#009387',handleChange}} />
            <TextArea attr={{field:'branchCode',value:formData.branchCode.toString(),icon:{name:'format-list-numbered',type:'MaterialIcons',min:5,color:'#5586cc'},keyboardType:'default',placeholder:'Enter branch code',color:'#009387',handleChange}} />
            <TextArea attr={{field:'accountType',value:formData.accountType.toString(),icon:{name:'home-switch',type:'MaterialCommunityIcons',min:5,color:'#5586cc'},keyboardType:'default',placeholder:'Enter account type',color:'#009387',handleChange}} />
            <View style={{marginTop:15}}>
                <Button 
                    btnInfo={{styles:{borderRadius:10,borderColor:colors.tomato,width:'100%'}}} 
                    textInfo={{text:'WITHDRAW',color:colors.tomato}} 
                    iconInfo={{type:'AntDesign', name:'minuscircleo',color:colors.tomato,size:16}}
                    handleBtnClick={handleBtnClick}
                />
            </View>
        </View>
    )
})

export default WithdrawFunds