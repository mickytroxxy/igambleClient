import {Dimensions, View } from 'react-native';
// @ts-ignore
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { BodySection } from '../components/profile/BodySection';
import { HeaderSection } from '../components/profile/HeaderSection';
import ForeGround from '../components/profile/ForeGround';
import { StatusBar } from 'expo-status-bar';
export default function Profile() {
  const {height} = Dimensions.get("screen");
  const parallaxH = parseInt((0.5 * height).toFixed(0));
  return (
    <View style={{flex: 1}}>
        <StatusBar style='light' />
        <ParallaxScrollView
            backgroundColor="#e8e9f5"
            contentBackgroundColor="#e8e9f5"
            backgroundScrollSpeed={5}
            fadeOutForeground ={true}
            showsVerticalScrollIndicator ={false}
            parallaxHeaderHeight={parallaxH}
            renderBackground={() => <HeaderSection/>}
            renderContentBackground={() => <BodySection />}
            renderForeground={() => <ForeGround/>}
        />
    </View>
  );
}