import React, { memo, useContext, useState } from 'react'
import { View, TouchableOpacity, Text, Image, Platform, ActivityIndicator } from 'react-native'
import { AntDesign, Ionicons, FontAwesome, EvilIcons} from "@expo/vector-icons";
import { useDispatch } from 'react-redux';
import { setModalState } from '../../state/slices/modalState';
import usePlayer from '../../hooks/usePlayer';
import { Switch, TouchableRipple } from 'react-native-paper';
import { colors } from '../../constants/Colors';
import { Button } from '../ui/Button';
interface SelectorProps {
    attr:{
        handleChange:(...args:any) => void;
        headerText?:string;
        items?:any;
    }
}
const ConfirmSelection = memo((props:SelectorProps) => {
    const {handleChange} = props.attr;
    const {selectedTracks, handleSelectedTracks} = usePlayer();
    return (
        <View style={{padding:16}}>
            {(selectedTracks  && selectedTracks?.length > 0) && selectedTracks?.map((item:any,i:number) => {
                const existingIndex = selectedTracks?.findIndex((track) => track.id === item.id);
                return(
                    <TouchableOpacity onPress={() => {}} key={i} style={{flexDirection:'row',borderBottomColor:'#757575',borderBottomWidth:0.7,paddingBottom:12}}>
                        <View style={{flex:1,justifyContent:'center'}}>
                            <View><Text style={{fontFamily:'fontBold'}}>{item.artist.name}</Text></View>
                            <View><Text style={{fontFamily:'fontLight'}}>{item.title}</Text></View>
                        </View>
                        <View style={{justifyContent:'center',flexDirection:'row'}}>
                            <View>
                                <TouchableRipple onPress={() => handleSelectedTracks(item)}>
                                    <View>
                                        <View pointerEvents="none">
                                            <Switch value={existingIndex !== -1} color={colors.green} />
                                        </View>
                                    </View>
                                </TouchableRipple>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            })}
            <View>
                <Button
                    btnInfo={{styles:{borderRadius:10,borderColor:'#63acfa',width:'100%',backgroundColor:'green'}}} 
                    textInfo={{text:'CONFIRM',color:colors.white}} 
                    iconInfo={{type:'FontAwesome', name:'play',color:colors.white,size:48}}
                    handleBtnClick={() => {
                        handleChange(true)
                    }}
                    disabled={selectedTracks?.length === 0}
                />
            </View>
        </View>
    )
})

export default ConfirmSelection