import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,Image, ScrollView
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from "expo-router";

import { colors } from "../constants/Colors";
import TextArea from "../components/ui/TextArea";
import Icon from "../components/ui/Icon";
import { StatusBar } from "expo-status-bar";
import { currencyFormatter } from "../helpers/methods";
import { useDispatch } from "react-redux";
import { setModalState } from "../state/slices/modalState";
import {TouchableRipple,Switch} from 'react-native-paper';
import usePlayer from "../hooks/usePlayer";
import { Button } from "../components/ui/Button";
import { setIsPlaying, setSelectedTracks, setSound } from "../state/slices/music";

const Artists = () => {
    const {formatTime,tracks, isPlaying,handlePlayPause, loadAudio, handleSelectedTracks, selectedTracks, currentAmount, searchArtistOrTrack} = usePlayer();
    const router = useRouter();
    const dispatch = useDispatch();
    const [searchResults,setSearchResults] = useState<any>(null);
    const [searchValue,setSearchValue] = useState<any>('');
    const dataToShow = (searchResults !== null && searchValue.length > 2) ? searchResults : tracks;
    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                title:'TRACK LIST', 
                headerRight: () => (
                    <View><Text style={{fontFamily:'fontBold',color:colors.white,fontSize:11}}>{currencyFormatter(currentAmount)}</Text></View>
                ),
                headerTitleStyle:{fontFamily:'fontBold',fontSize:12}}} 
            />
            <StatusBar style='light' />
            <LinearGradient colors={["#fff", "#fff", "#fff", "#f1f7fa"]} style={styles.gradientContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View>
                        <TextArea attr={{field:'search',icon:{name:'search',type:'FontAwesome',min:5,color:'#5586cc'},keyboardType:'default',placeholder:'Search For tracks...',color:'#009387',handleChange:async(field,value)=>{
                            setSearchValue(value);
                            if(value.length > 2){
                              const response = await searchArtistOrTrack(value);
                              if(response){
                                setSearchResults(response)
                              }
                            }
                        }}} />
                    </View>
                    <View style={{marginTop:30,justifyContent:'space-around',gap:12}}>
                        {(dataToShow  && dataToShow?.length > 0) && dataToShow?.slice(0,30)?.map((item:any,i:number) => {
                            const existingIndex = selectedTracks?.findIndex((track) => track.id === item.id);
                            return(
                                <TouchableOpacity onPress={() => {}} key={i} style={{flexDirection:'row',borderBottomColor:'#757575',borderBottomWidth:0.7,paddingBottom:12}}>
                                    <View style={{flex:1,justifyContent:'center'}}>
                                        <View><Text style={{fontFamily:'fontBold'}}>{item.artist.name}</Text></View>
                                        <View><Text style={{fontFamily:'fontLight'}}>{item.title}</Text></View>
                                    </View>
                                    <View style={{justifyContent:'center',flexDirection:'row'}}>
                                        <View>
                                            <TouchableOpacity onPress={async() => {
                                                if(isPlaying.trackId === item.id){
                                                    handlePlayPause(isPlaying.state ? 'PAUSE' : 'PLAY');
                                                }else{
                                                    loadAudio(item.preview,item?.id,true,true)
                                                } 
                                            }}>
                                                {isPlaying.trackId === item.id ?
                                                    <View>
                                                        {!isPlaying.state && <Icon name="playcircleo" type="AntDesign" color={"green"} size={30} />}
                                                        {isPlaying.state && <Icon name="pausecircleo" type="AntDesign" color={"orange"} size={30} />}
                                                    </View> :
                                                    <View>
                                                        <Icon name="playcircleo" type="AntDesign" color={"green"} size={30} />
                                                    </View>
                                                }
                                            </TouchableOpacity>
                                            <Text style={{fontFamily:'fontLight',fontSize:11}}>{formatTime(item?.duration)}</Text>
                                        </View>
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
                    </View>
                </ScrollView>
                <View>
                <Button
                    btnInfo={{styles:{borderRadius:10,borderColor:'#63acfa',width:'100%',backgroundColor:'green'}}} 
                    textInfo={{text:'PLAY SELECTED TRACKS',color:colors.white}} 
                    iconInfo={{type:'FontAwesome', name:'play',color:colors.white,size:48}}
                    handleBtnClick={() => {
                        dispatch(setModalState({isVisible:true,attr:{headerText:'CONFIRM SELECTION',handleChange:async(res:any)=>{
                            if(isPlaying?.isPreview && isPlaying.state){
                                await handlePlayPause('PAUSE');
                                router.push('MusicPlayer');
                            }else{
                                router.push('MusicPlayer')
                            }
                            dispatch(setModalState({isVisible:false}))
                        }}}))
                    }}
                    disabled={selectedTracks?.length === 0}
                />
                </View>
                <View style={{alignItems:'flex-end'}}><TouchableOpacity onPress={async() => {
                    await handlePlayPause('PAUSE')
                    dispatch(setSound(null));
                    dispatch(setIsPlaying({state:false,trackId:null,isPreview:false}))
                    dispatch(setSelectedTracks([]))
                }}><Text style={{fontFamily:'fontBold',color:'tomato',marginVertical:6}}>RESET PLAYER</Text></TouchableOpacity></View>
            </LinearGradient>
        </View>
    );
};

export default Artists;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
    marginTop: 5,
    borderRadius: 10,
    elevation: 5,
  },
  gradientContainer: {
    flex: 1,
    padding:10

  },
  text: {
    fontFamily: "fontLight",
    marginBottom: 15,
    textAlign: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginTop: 15,
  },
  searchInputContainer: {
    height: 40,
    borderRadius: 10,
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: "#a8a6a5",
  },
  myBubble: {
    backgroundColor: "#7ab6e6",
    padding: 5,
    minWidth: 100,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
