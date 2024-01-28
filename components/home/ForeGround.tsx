import React, { memo, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import useLocation from '../../hooks/useLocation';
import Filter from './Filter';
import useUsers from '../../hooks/useUsers';
import Icon from '../ui/Icon';
import * as Animatable from 'react-native-animatable';
import { setActiveUser } from '../../state/slices/users';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { Text } from 'react-native';

interface ForeGroundProps {
  // Add any necessary props here
}

const ForeGround: React.FC<ForeGroundProps> = memo(() => {
  const { location } = useLocation();
  const {users} = useUsers();
  const dispatch = useDispatch();
  const router = useRouter();
  const mapView = useRef<MapView>(null);

  const initialRegion: Region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  };

  return (
    <View style={{ flex: 1 }}>
        <Filter/>
        <View style={styles.mapStyle}>
          <View style={{paddingHorizontal:30}}>
            <Text style={{color:'tomato',fontFamily:'fontBold',textAlign:'center'}}>Gambling is addictictive, only gamble with what you can afford to lose!. Strictly no under age</Text>
            <View style={{marginTop:10,alignItems:'center'}}><Icon type="FontAwesome" name="ban" color="tomato" size={72} /></View>
          </View>
        </View>
    </View>
  );
});

export const styles = StyleSheet.create({
  footerStyle: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    elevation: 10,
    paddingBottom: 30,
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor:'black',
    justifyContent:'center', alignItems:'center'
  },
});

export default ForeGround;
