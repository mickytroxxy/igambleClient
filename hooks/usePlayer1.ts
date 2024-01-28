import { useEffect, useState } from 'react';
import axios from 'axios';
import * as AppAuth from "expo-app-auth";

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const clientId = "670cae01c0e14bd38ae9816bce58711f";
const clientSecret = '01d48fe9f1944c13880dcc31cf9fd3ef';
const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';
const usePlayer = () => {
    const [accessToken,setAccessToken] = useState();
    const getAccessToken = async () => {
        try {
          const response:any = await axios.post(SPOTIFY_TOKEN_URL, {grant_type:'client_credentials',client_id:clientId,client_secret:clientSecret}, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
          if(response){
            setAccessToken(response?.data?.access_token)
            getPlaylistDetails(response?.data?.access_token)
          }
        } catch (error) {
          console.error('Error getting access token:', error);
        }
    };
    const getPlaylistDetails = async (accessToken:any) => {
        const playlistId = '3cEYpjA9oz9GiPac4AsH4n';
        try {
          const response = await axios.get(`${SPOTIFY_API_BASE_URL}/playlists/${playlistId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
      
          console.log(response.data);
          // Handle the playlist details in response.data
        } catch (error) {
          console.error('Error fetching playlist details:', error);
        }
    };
    const searchAlbums = async (accessToken:any) => {
        try {
          const response = await axios.get(`${SPOTIFY_API_BASE_URL}/search`, {
            params: {
              q: 'vybz kartel',
              type: 'track',
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
      
          console.log(JSON.stringify(response.data));
          // Handle the search results in response.data
        } catch (error) {
          console.error('Error searching albums:', error);
        }
    };
    const authenticate = async() => {
        const config = {
            issuer:"https://accounts.spotify.com", clientId,
            scopes: [
              "user-read-email",
              "user-library-read",
              "user-read-recently-played",
              "user-top-read",
              "playlist-read-private",
              "playlist-read-collaborative",
              "playlist-modify-public" // or "playlist-modify-private"
            ],
            redirectUrl:"exp://localhost:19002/--/spotify-auth-callback"
        }
        const result = await AppAuth.authAsync(config);
    }
    useEffect(() => {
        getAccessToken();
    },[])
    return {getAccessToken, accessToken};
};

export default usePlayer;
