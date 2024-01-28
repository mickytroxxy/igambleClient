import React, { memo, useState } from 'react';
import { TouchableOpacity, Text, View} from 'react-native';
import Icon from './Icon';
import { AddressButtonProps, ButtonProps, IconButtonProps, LocationType } from '../../constants/Types';
import { useDispatch } from 'react-redux';
import { setModalState } from '../../state/slices/modalState';
import { colors } from '../../constants/Colors';


export const Button: React.FC<ButtonProps> = memo((props) => {
  const { btnInfo, textInfo, iconInfo, handleBtnClick, disabled } = props;

  return (
    <TouchableOpacity disabled={disabled}  onPress={handleBtnClick} style={[{ borderRadius: 5, padding: 15, borderColor: '#14678B', borderWidth: 0.7, flexDirection: 'row', width: '100%', marginTop: 10 }, btnInfo?.styles, disabled && {backgroundColor:'grey'}]}>
      <Icon type={iconInfo.type} name={iconInfo.name} size={iconInfo.size} color={iconInfo.color} />
      <View style={{ marginLeft: 5, justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'fontBold', color: textInfo?.color, fontSize: 11, textAlign: 'center' }} numberOfLines={1}>{textInfo?.text}</Text>
      </View>
    </TouchableOpacity>
  );
});



export const IconButton: React.FC<IconButtonProps> = memo((props) => {
  const { iconInfo, handleBtnClick } = props;

  return (
    <TouchableOpacity onPress={handleBtnClick}>
      <Icon type={iconInfo.type} name={iconInfo.name} size={iconInfo.size} color={iconInfo.color} />
    </TouchableOpacity>
  );
});

export const AddressButton: React.FC<AddressButtonProps> = memo((props) => {
  const dispatch = useDispatch();
  const [searchLocation,setSearchLocation] = useState<LocationType>();
  const handleChange = (field:string,value:LocationType) => {
    setSearchLocation(value)
    props.handleBtnClick(value);
  };
  return(
    <View style={{marginTop:10}}>
      <TouchableOpacity onPress={() => {
        dispatch(setModalState({isVisible:true,attr:{headerText:'SELECT LOCATION',placeHolder:'Give Us A Location',field:'meetUpLocation',cb:handleChange}}))
      }} style={{backgroundColor : "#fff",width:'100%',borderRadius:10,padding:10,borderColor:'#63acfa',borderWidth:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
        <Icon type="Ionicons" name="ios-location-outline" color={colors.green} size={24} />
        <Text style={{fontFamily:'fontLight',color:colors.grey,fontSize:13,flex:1,marginLeft:5}}>{!searchLocation ? (props.placeholder ? props.placeholder : 'Give Us A Location') : searchLocation.text} </Text>
      </TouchableOpacity>
    </View>
  )
})