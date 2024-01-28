
import React from 'react'
import { View } from 'react-native';
import { GlobalStyles } from '../styles';
import SplashScreen from './SplashScreen';
import Home from './Home';
import {  useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { StatusBar } from 'expo-status-bar';

const index = () => {
  const accountInfo = useSelector((state: RootState) => state.accountInfo); 
  return(
    <View style={GlobalStyles.container}>
      {!accountInfo ? <SplashScreen/> : <Home/>}
      <StatusBar style='dark' />
    </View>
  )
}
export default index