import { PayloadAction, createSlice } from "@reduxjs/toolkit";
export type DeezerTrack = {
    id: string;
    readable: boolean;
    title: string;
    trackUrl?:string;
    title_short: string;
    title_version: string;
    link: string;
    duration: string; // Assuming duration is provided in seconds as a string
    rank: string;
    explicit_lyrics: boolean;
    explicit_content_lyrics: number;
    explicit_content_cover: number;
    preview: string;
    md5_image: string;
    artist: {
        id: string;
        name: string;
        link: string;
        picture: string;
        picture_small: string;
        picture_medium: string;
        picture_big: string;
        picture_xl: string;
        tracklist: string;
        type: "artist";
    };
    album: {
        id: string;
        title: string;
        cover: string;
        cover_small: string;
        cover_medium: string;
        cover_big: string;
        cover_xl: string;
        md5_image: string;
        tracklist: string;
        type: "album";
    };
    type: "track";
};
export type isPlayingStatusTypes = {state:boolean,trackId:any,isPreview:boolean}
const initialState: { artists: any; tracks:DeezerTrack[];selectedTracks:DeezerTrack[],trackStatus:any,playedMusic:DeezerTrack[], isPlaying:isPlayingStatusTypes,sound:any} = {
  artists: [],
  tracks:[],
  selectedTracks:[],
  trackStatus:null,
  playedMusic:[],
  isPlaying:{state:false,trackId:null,isPreview:true},
  sound:null
};

const musicSlice = createSlice({
  name: "musicSlice",
  initialState,
  reducers: {
    setArtists: (state, action: PayloadAction<any>) => {
      state.artists = action.payload;
    },
    setTracks: (state, action: PayloadAction<any>) => {
      state.tracks = action.payload;
    },
    setSelectedTracks: (state, action: PayloadAction<any>) => {
        state.selectedTracks = action.payload;
    },
    setTrackStatus: (state, action: PayloadAction<any>) => {
        state.trackStatus = action.payload;
    },
    setPlayedMusic: (state, action: PayloadAction<any>) => {
      state.playedMusic = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<isPlayingStatusTypes>) => {
      state.isPlaying = action.payload;
    },
    setSound: (state, action: PayloadAction<any>) => {
      state.sound = action.payload;
    }
  },
});

export const { setArtists, setTracks,setPlayedMusic, setSelectedTracks,setTrackStatus, setIsPlaying, setSound  } = musicSlice.actions;
export default musicSlice.reducer;
