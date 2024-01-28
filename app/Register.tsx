import {Dimensions, View } from 'react-native';
// @ts-ignore
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { HeaderSection } from '../components/auth/HeaderSection';
import { RegisterBodySection } from '../components/auth/RegisterBodySection';
export default function Register() {
  const {height} = Dimensions.get("screen");
  const parallaxH = parseInt((0.375 * height).toFixed(0));
  return (
    <View style={{flex: 1}}>
        <ParallaxScrollView
            backgroundColor="#e8e9f5"
            contentBackgroundColor="#e8e9f5"
            backgroundScrollSpeed={5}
            fadeOutForeground ={true}
            showsVerticalScrollIndicator ={false}
            parallaxHeaderHeight={parallaxH}
            renderBackground={() => <HeaderSection/>}
            renderContentBackground={() => <RegisterBodySection />}
        />
    </View>
  );
}