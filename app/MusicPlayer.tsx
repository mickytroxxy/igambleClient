import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from "expo-router";
import { colors } from "../constants/Colors";
import Icon from "../components/ui/Icon";
import usePlayer from "../hooks/usePlayer";
import { currencyFormatter, showToast } from "../helpers/methods";
import { useDispatch } from "react-redux";
import { setSelectedTracks } from "../state/slices/music";


const MusicPlayer = () => {
    const {loadAudio, isPlaying, handlePlayPause, trackStatus, currentTrack, formatTime, getMp3FromVideos, updateTokenBalance, currentAmount, trackCost, isMainPlayer,fetchById,isLoading,setIsLoading} = usePlayer()
    const handlePlayMusic = async () => {
        fetchById(currentTrack,true,(response) => {
            if(currentAmount >= trackCost){
                if(!isPlaying.state){
                    if(!isMainPlayer){
                        loadAudio(response.trackUrl,response?.id,true,false);
                        updateTokenBalance();
                        setIsLoading(false);
                        getMp3FromVideos();
                    }
                }
            }else{
                showToast("You have run out of funds to play music")
            }
        });
    }
    useEffect(() => {
        if(currentTrack){
            handlePlayMusic()
        }
    }, [currentTrack, isPlaying]);
    useEffect(() => {
        if(isPlaying.state){
            setIsLoading(false)
        }
    },[])
    return (
        <LinearGradient colors={["#000", "#fff", "#fff", "#000"]} style={styles.container}>
            <Stack.Screen 
                options={{ 
                    headerShown: false,
                    headerRight: () => (
                        <View><Text style={{fontFamily:'fontBold',color:colors.white,fontSize:11}}>{currencyFormatter(currentAmount)}</Text></View>
                    )
                }} 
                
            />
            <Text style={{ fontFamily: 'fontBold', fontSize: 18 }}>{currentTrack?.artist.name}</Text>
            <Text style={{ fontFamily: 'fontLight', fontSize: 14,marginVertical:10 }}>{currentTrack?.title}</Text>
            <View style={{ width: 260, height: 260, backgroundColor: colors.green, justifyContent: 'center', alignItems: 'center', borderRadius: 200 }}>
                <View style={{ width: 240, overflow: 'hidden', height: 240, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', borderRadius: 200 }}>
                    <Icon name="music" type="Feather" color="green" size={145} />
                </View>
            </View>
            <View style={{ marginTop: 30 }}>
                <Text style={{ fontFamily: 'fontBold', fontSize: 18, textAlign:'center' }}>{trackStatus && formatTime(currentTrack?.duration as any || 0)}</Text>
            </View>
            <View style={{marginTop:20}}>
                
            </View>
            <View style={{ position: 'absolute', bottom: 50 }}>
                {!isLoading ? 
                    <TouchableOpacity onPress={() => {handlePlayPause(isPlaying.state ? 'PAUSE' : 'PLAY', true)}}>
                        {!isPlaying.state && <Icon name="playcircleo" type="AntDesign" color={"green"} size={60} />}
                        {isPlaying.state && <Icon name="pausecircleo" type="AntDesign" color={"orange"} size={60} />}
                    </TouchableOpacity> :
                    <ActivityIndicator size={80} color={'green'} />
                }
            </View>
        </LinearGradient>
    );
};

export default MusicPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
