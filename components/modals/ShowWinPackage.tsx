import React, { memo } from 'react'
import { View, Text } from 'react-native'
import Icon from '../ui/Icon';
import { colors } from '../../constants/Colors';
import { GamblingItemsType } from '../../constants/Types';
import { currencyFormatter } from '../../helpers/methods';
import { Button } from '../ui/Button';
import { useRouter } from 'expo-router';
import { setModalState } from '../../state/slices/modalState';
import { useDispatch } from 'react-redux';
type PriceTypeProps = {
    attr:{
        packages:GamblingItemsType[],
        status?:boolean;
        claim?:boolean;
    }
}
const ShowWinPackage = memo((props:PriceTypeProps) => {
    const {packages,status} = props.attr;
    const router = useRouter();
    const dispatch = useDispatch();
    return (
        <View style={{flex:1,marginTop:10,padding:10}}>
            <View>{status && <Text style={{textAlign:'center',color:colors.orange,fontFamily:'fontBold',fontSize:20,marginBottom:30}}>CONGRATULATIONS!!!</Text>}</View>
            {status && <View style={{flexDirection:'row'}}>{[1,2,3,4,5,6,7,8,9,10].map((item) => <View style={{width:'10%',alignItems:'center'}} key={item}><Icon type='MaterialIcons' name="star" size={30} color={colors.orange} /></View>)}</View>}
            {packages.map((item, i) => {
                return(
                    <View key={item.id * i} style={{marginBottom:15,backgroundColor:colors.faintGray,borderRadius:5,padding:10}}>
                        <View style={{flexDirection:'row',margin:5,backgroundColor:"#FFAEA2",padding:5,borderRadius:5,height:50,justifyContent:'center'}}>
                            <View style={{flex:1,justifyContent:'center'}}><Text style={{fontFamily:'fontBold',fontSize:13,color:colors.white}}>{item.class}</Text></View>
                            <View style={{justifyContent:'center'}}><Text style={{fontFamily:'fontBold',fontSize:13,color:colors.white}}>EST {currencyFormatter(item.totalCost)}</Text></View>
                        </View>
                        {item?.items?.map((innerItem) => 
                            <View key={innerItem} style={{flexDirection:'row',padding:5}}>
                                <View style={{flex:1}}><Icon type='MaterialIcons' name="check-circle" size={16} color={colors.green} /></View>
                                <View><Text style={{fontFamily:'fontBold',fontSize:11}}>{innerItem}</Text></View>
                            </View>
                        )}
                        <View style={{padding:5,backgroundColor:colors.white,borderRadius:5}}>
                            <Text style={{fontFamily:'fontLight',fontSize:12}}>{item.description}</Text>
                        </View>
                        {status && (
                            <View style={{marginTop:10}}>
                                <Button 
                                    btnInfo={{styles:{borderRadius:5,borderColor:colors.orange,width:'99%',backgroundColor:item.selected ? '#F9B030' : colors.white,padding:5}}} 
                                    textInfo={{text:item.status === 0 ? "CLAIM PACKAGE" : (item.status === 1 ? "PENDING" : "COMPLETED"),color: !item.selected ? '#F9B030' : colors.white}} 
                                    iconInfo={{type: 'Ionicons', name: item.status === 0 ? "add-circle-outline" : (item.status === 1 ? "timer-outline" : "checkmark-done-circle-sharp"),color:!item.selected ? '#F9B030' : colors.white,size:30}}
                                    handleBtnClick={() => {
                                        if(item.status === 0){
                                            router.push({pathname:'Claim',params:{packageParams:JSON.stringify(item)}})
                                            dispatch(setModalState({isVisible:false}));
                                        }
                                    }}
                                />
                            </View>
                        )}
                    </View>
                )
            })}
            {status && <View style={{flexDirection:'row'}}>{[1,2,3,4,5,6,7,8,9,10].map((item) => <View key={item} style={{width:'10%',alignItems:'center'}}><Icon type='MaterialIcons' name="star" size={30} color={colors.orange} /></View>)}</View>}
        </View>
    )
})

export default ShowWinPackage