import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image, ScrollView, Text
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from "expo-router";

import TextArea from "../components/ui/TextArea";
import { StatusBar } from "expo-status-bar";

import usePlayer from "../hooks/usePlayer";
import { colors } from "../constants/Colors";
import { currencyFormatter } from "../helpers/methods";

const Artists = () => {
    const {artists, getArtistTracks,getAllArtists, isPlaying, currentAmount, searchArtistOrTrack} = usePlayer();
    const [searchResults,setSearchResults] = useState<any>(null);
    const [searchValue,setSearchValue] = useState<any>('');
    const dataToShow = (searchArtistOrTrack !== null && searchValue.length > 2) ? searchResults : artists;
    const isSearchResults = (searchArtistOrTrack !== null && searchValue.length > 2) ? true : false;
    useEffect(() => {
      getAllArtists();
    },[])
    return (
        <View style={styles.container}>
            <Stack.Screen options={{
              title:'SELECT ARTIST', 
              headerRight: () => (
                <View><Text style={{fontFamily:'fontBold',color:colors.white,fontSize:11}}>{currencyFormatter(currentAmount)}</Text></View>
              ),
              headerTitleStyle:{fontFamily:'fontBold',fontSize:12},
              
            }} />
            <StatusBar style='light' />
            <LinearGradient colors={["#fff", "#fff", "#fff", "#f1f7fa"]} style={styles.gradientContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View>
                        <TextArea attr={{field:'search',icon:{name:'search',type:'FontAwesome',min:5,color:'#5586cc'},keyboardType:'default',placeholder:'Search For Artists...',color:'#009387',handleChange:async(field,value)=>{
                            setSearchValue(value);
                            if(value.length > 2){
                              const response = await searchArtistOrTrack(value);
                              if(response){
                                setSearchResults(response)
                              }
                            }
                        }}} />
                    </View>
                    <View style={{marginTop:30,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-around',gap:12}}>
                        {(dataToShow  && dataToShow?.length > 0) && dataToShow?.map((item:any,i:number) => {
                            return(
                                <View key={i} style={{width:'48%',height:220,borderRadius:10}}>
                                  <TouchableOpacity onPress={() => getArtistTracks(!isSearchResults ? item.id : item?.artist?.id)} key={i} style={{width:'100%',height:200,backgroundColor:'black',borderRadius:10,padding:2}}>
                                    <Image source={{uri:item.picture_big || item?.artist?.picture_big}} style={{height:'94%',aspectRatio:1,borderRadius:10}} />
                                  </TouchableOpacity>
                                  <View style={{padding:5}}><Text style={{color:'#757575',fontFamily:'fontBold',fontSize:12}}>{item?.name || item?.artist?.name}</Text></View>
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>
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
