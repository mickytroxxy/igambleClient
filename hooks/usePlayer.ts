import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { DeezerTrack, setArtists, setIsPlaying, setSelectedTracks, setSound, setTrackStatus, setTracks } from '../state/slices/music';
import { useRouter } from 'expo-router';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { updateData } from '../helpers/api';
import { setCurrentToken } from '../state/slices/game';
import { showToast } from '../helpers/methods';

const BASE_URL = 'http://empiredigitalsapi.net:7624/files/'

Audio.setAudioModeAsync({
    staysActiveInBackground: true,
    playsInSilentModeIOS: true,
    interruptionModeIOS: InterruptionModeIOS.DuckOthers, // Change as you like
    interruptionModeAndroid: InterruptionModeAndroid.DuckOthers, // Change as you like
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: true,
});
const usePlayer = () => {
    const router = useRouter();
    const {artists,tracks,selectedTracks, trackStatus, isPlaying, sound} = useSelector((state: RootState) => state.music);
    const dispatch = useDispatch();
    const [trackCost,setTrackCost] = useState(2);
    const [artistIds,setArtistIds] = useState(["100675","72481502","8671236","116337","38","102","4768753","293585"]);
    const currentTrack = selectedTracks?.[0];
    const {currentToken} = useSelector((state: RootState) => state.game);
    const currentAmount = currentToken?.currentAmount;
    const [isMainPlayer,setIsMainPlayer] = useState(false)
    const [isLoading,setIsLoading] = useState(true);
    const getArtistById = async (artistId:any) => {
        const options = {
          method: 'GET',
          url: `https://deezerdevs-deezer.p.rapidapi.com/artist/${artistId}`,
          headers: {
            'X-RapidAPI-Key': '874f3f7ebcmshf0918d751c639c4p1b9288jsnc88d532ee945',
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
          }
        };
        try {
          const response = await axios.request(options);
          return response.data; // Return the artist data
        } catch (error) {
          throw error;
        }
    };
    const updateTokenBalance = async () => {
        const balance = currentAmount - trackCost;
        updateData("tokens",currentToken?.token,{field:'currentAmount',value:balance});
        dispatch(setCurrentToken({...currentToken,currentAmount:balance}))
    }
    const getAllArtists = async () => {
        try {
          const artistPromises = artistIds.map(artistId => getArtistById(artistId));
          const artists = await Promise.all(artistPromises);
          dispatch(setArtists(artists));
        } catch (error) {
          console.error('Error fetching artists:', error);
        }
    };
    const getArtistTracks = async (id:number) => {
        const options = {method: 'GET', url: `https://api.deezer.com/artist/${id}/top?limit=50`};
        try {
            const response = await axios.request(options);
            dispatch(setTracks(response?.data?.data));
            router.push('Tracks')
        } catch (error) {
            console.error(error);
        }
    }
    const searchArtistOrTrack = async (query:string) => {
        let url = `https://api.deezer.com/search?q=${query}`
        const options = {method: 'GET',url};
          try {
            const response = await axios.request(options);
            return response?.data?.data?.slice(0,6);
          } catch (error) {
            console.error(error);
            return null;
          }
    }
    const loadAudio = useCallback(async (audioUrl:any,trackId:any,shouldPlay:boolean,isPreview:boolean) => {
        if(!isPlaying.state){
            await handlePlayPause('PAUSE')
            const { sound:s } = await Audio.Sound.createAsync(
                {uri: audioUrl},
                {shouldPlay }
            );
            dispatch(setSound(s));
            dispatch(setIsPlaying(({...isPlaying,trackId,state:shouldPlay,isPreview})));
        }
    },[isPlaying,sound]);
    const handlePlayPause = async(state: 'PLAY' | 'PAUSE',isMainPlayer?:any) => {
        setIsMainPlayer(isMainPlayer);
        state === 'PAUSE' ? await pauseSound() : await playSound();
        dispatch(setIsPlaying(({...isPlaying,state:isPlaying.state ? false : true})));
    }
    const playSound = async () => await sound?.playAsync();
    const pauseSound = async () => await sound?.pauseAsync();
    const handleSoundStatus = () => {
        if (sound) {
            sound?.setOnPlaybackStatusUpdate((status: any) => {
                //dispatch(setTrackStatus(status));
                //console.log(status)
                if (status.didJustFinish) {
                    const existingIndex = selectedTracks.findIndex((track) => track?.id?.toString() === isPlaying?.trackId?.toString());
                    if (existingIndex !== -1) {
                        const updatedTracks = [...selectedTracks];
                        updatedTracks.splice(existingIndex, 1);
                        dispatch(setSelectedTracks(updatedTracks));
                    }
                    setIsMainPlayer(false)
                    dispatch(setIsPlaying({trackId: null,state: false, isPreview: isPlaying.isPreview}));
                }
            });
        }
    };
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds?.toFixed(0).toString().padStart(2, '0')}`;
    };
    const handleSelectedTracks = (obj: DeezerTrack) => {
        const existingIndex = selectedTracks.findIndex((track) => track.id === obj.id);
        if (existingIndex !== -1) {
            const updatedTracks = [...selectedTracks];
            updatedTracks.splice(existingIndex, 1);
            dispatch(setSelectedTracks(updatedTracks));
        } else {
            dispatch(setSelectedTracks([...selectedTracks, obj]));
        }
    };
    const convertVideo = async (searchQuery:string) => {
        try {
            const response = await axios.post('http://empiredigitalsapi.net:7624/convertVideo', {searchQuery});
            if(response){
                const trackName = response.data.track;
                return trackName;
            }
        } catch (error) {
            console.log(error)
            return null;
        }
    }
    const getMp3FromVideos = async () => {
        const promises = (selectedTracks || []).map(track => {
            return new Promise<void>((resolve) => {
                fetchById(track,false, (response) => {
                    resolve();
                });
            });
        });
        await Promise.all(promises);
    };
    const fetchById = async(track:DeezerTrack,showLoading:boolean,cb:(response:DeezerTrack) => void) => {
        if(!track?.trackUrl){
            if(showLoading && !isPlaying.state){
                setIsLoading(true);
            }
            const trackName = await convertVideo(`${track?.artist?.name} ${track.title}`);
            if(trackName){
                const trackUrl = BASE_URL+trackName;
                cb({...track,trackUrl});
                dispatch(setSelectedTracks(selectedTracks.map(item => item.id === track.id ? {...item,trackUrl} : {...item})));
            }else{
                cb({...track,trackUrl:track.preview});
                dispatch(setSelectedTracks(selectedTracks.map(item => item.id === track.id ? {...item,trackUrl:track.preview} : {...item})))
                showToast(`There was an error fetching ${track?.artist?.name} ${track.title}`)
            }
        }else{
            return track;
        }
    }
    useEffect(() => {
        handleSoundStatus();
    }, [sound, isPlaying]);
    return {artists,fetchById,isLoading,setIsLoading, searchArtistOrTrack,pauseSound, getArtistTracks, tracks, loadAudio, isPlaying, setIsPlaying, handlePlayPause, getAllArtists,formatTime, handleSelectedTracks, selectedTracks, currentTrack, trackStatus, getMp3FromVideos, updateTokenBalance, currentAmount,trackCost, isMainPlayer,setIsMainPlayer};
};

export default usePlayer;