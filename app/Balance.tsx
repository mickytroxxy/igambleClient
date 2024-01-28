import {Dimensions, View } from 'react-native';
// @ts-ignore
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { BodySection } from '../components/balance/BodySection';
import { HeaderSection } from '../components/balance/HeaderSection';
export default function Balance() {
  const {height} = Dimensions.get("screen");
  const parallaxH = parseInt((0.3 * height).toFixed(0));
  return (
    <View style={{flex: 1}}>
        <ParallaxScrollView
            backgroundColor="#FFD6D0"
            contentBackgroundColor="#FFD6D0"
            backgroundScrollSpeed={5}
            fadeOutForeground ={true}
            showsVerticalScrollIndicator ={false}
            parallaxHeaderHeight={parallaxH}
            renderBackground={() => <HeaderSection/>}
            renderContentBackground={() => <BodySection />}
        />
    </View>
  );
}