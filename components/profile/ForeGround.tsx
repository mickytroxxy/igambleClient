import React, { memo, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, Platform } from 'react-native';
import useUsers from '../../hooks/useUsers';
import { showToast } from '../../helpers/methods';
import Icon from '../ui/Icon';
import { colors } from '../../constants/Colors';
import useUpdates from '../../hooks/useUpdates';

interface ForeGroundProps {}

const ForeGround: React.FC<ForeGroundProps> = memo(() => {
  const {activeUser:{fname,isVerified},profileOwner} = useUsers();
  const {handleUploadPhotos} = useUpdates();
  //https://firebasestorage.googleapis.com/v0/b/wetowing-9fcd4.appspot.com/o/avatars%2F27658016132%2F27658016132.png?alt=media&token=0473b4b7-7978-4a0f-aee7-a0c759c26603
  return (
    <View style={{flex: 1,marginTop: Platform.OS === 'android' ? -120 : -50 }}>
      <View style={{flex:3}}></View>
      <View style={{flex:1,padding:5,flexDirection:'row'}}>
        <View style={styles.usernameView}><Text style={{color:'#fff',fontSize:12,fontFamily:'fontBold'}}>{fname}</Text></View>
        <View style={{marginLeft:30}}>
            {profileOwner ? (
                <TouchableOpacity onPress={() => handleUploadPhotos('avatar')} style={{backgroundColor:colors.green,padding:5,borderRadius:100,height:48,width:48,alignItems:'center',justifyContent:'center'}}>
                    <Icon type='Ionicons' name="ios-camera" size={30} color={colors.white} />
                </TouchableOpacity>
            ):(
                <View>
                    <TouchableOpacity onPress={()=>{
                        if(isVerified){
                            showToast(fname +" has been verified!")
                        }else{
                            showToast(fname +" is not verified yet!")
                        }
                    }}>
                        {isVerified ? (
                            <Icon type='Ionicons' name="shield-checkmark" size={44} color="green" />
                        ):(
                            <Icon type='Feather' name="shield-off" size={44} color="tomato" />
                        )}
                    </TouchableOpacity>
                </View>
                
            )}
        </View>
      </View>
    </View>
  );
});

export const styles = StyleSheet.create({
  usernameView:{
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    height: 50, 
    alignContent:"center", 
    alignItems:"center",
    borderTopRightRadius:50,
    borderBottomRightRadius:700,
    justifyContent:'center',
    marginLeft:5,
    borderTopLeftRadius:700,
    flex:1
  },  
});

export default ForeGround;
