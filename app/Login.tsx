import { StyleSheet, Dimensions, View } from 'react-native';
// @ts-ignore
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { HeaderSection } from '../components/auth/HeaderSection';
import { BodySection } from '../components/auth/BodySection';
import { StatusBar } from 'expo-status-bar';
export default function Login() {
  const {height} = Dimensions.get("screen");
  const parallaxH = parseInt((0.375 * height).toFixed(0));
  return (
    <View style={styles.container}>
        <ParallaxScrollView
            backgroundColor="#e8e9f5"
            contentBackgroundColor="#e8e9f5"
            backgroundScrollSpeed={5}
            fadeOutForeground ={true}
            showsVerticalScrollIndicator ={false}
            parallaxHeaderHeight={parallaxH}
            //renderForeground={() => <Foreground navigation={navigation}/>}
            renderBackground={() => <HeaderSection/>}
            renderContentBackground={() => <BodySection />}
        />
        <StatusBar style='light' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
