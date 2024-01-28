import {Dimensions, View, Text } from 'react-native';
// @ts-ignore
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { HeaderSection } from '../components/home/HeaderSection';
import { BodySection } from '../components/home/BodySection';
import ForeGround from '../components/home/ForeGround';
import { styles } from '../components/home/BodySection';
export default function Home() {
  const {height} = Dimensions.get("screen");
  const parallaxH = parseInt((0.725 * height).toFixed(0));
  
  return (
    <View style={{flex: 1}}>
      <ParallaxScrollView
        backgroundColor="#e8e9f5"
        contentBackgroundColor="#e8e9f5"
        backgroundScrollSpeed={50}
        fadeOutForeground ={false}
        showsVerticalScrollIndicator ={false}
        parallaxHeaderHeight={parallaxH + 30}
        renderBackground={() => <HeaderSection/>}
        renderForeground={() => <ForeGround/>}
        renderContentBackground={() => <BodySection />}
      />
    </View>
  );
}