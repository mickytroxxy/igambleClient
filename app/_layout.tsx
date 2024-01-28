import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { RootState, persistor, store } from '../state/store';
import { PersistGate } from 'redux-persist/integration/react';
import { StatusBar } from 'expo-status-bar';
import ConfirmDialog from '../components/modals/ConfirmDialog';
import ModalController from '../components/ui/modal';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Platform, TouchableOpacity } from 'react-native';
import Icon from '../components/ui/Icon';
import { colors } from '../constants/Colors';

export {ErrorBoundary} from 'expo-router';


export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    fontLight: require('../assets/fonts/MontserratAlternates-Light.otf'),
    fontBold: require('../assets/fonts/MontserratAlternates-Bold.otf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return (
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>
        <RootSiblingParent>
          {!loaded && <SplashScreen />}
          {loaded && <RootLayoutNav />}
          <ConfirmDialog/>
          <ModalController/>
        </RootSiblingParent>
      </Provider>
      <StatusBar style='light' />
    </PersistGate>
  );
}

function RootLayoutNav() {
  const { title } = useSelector((state: RootState) => state.modalData); 
  const router = useRouter();
  return (
    <Stack initialRouteName="Login" screenOptions={{
      headerStyle: {backgroundColor: "#FFAEA2"},
      headerTintColor: "#fff",
      headerTitleStyle: {fontFamily:'fontBold',fontSize:12},
      headerLeft: () => (<TouchableOpacity onPress={() => router.back()} style={{marginRight:Platform.OS === 'android' ? 5 : 0,marginLeft:-10}}><Icon type="Feather" name="arrow-left-circle" size={30} color={colors.white} /></TouchableOpacity>)
    }}>
      <Stack.Screen name="Home" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="Profile" options={{title: "USER PROFILE", }} />
      <Stack.Screen name="SplashScreen" options={{ headerShown: false }} />
      <Stack.Screen name="Balance" options={{title: "YOUR BALANCE", }} />
      <Stack.Screen name="Login" options={{title: "LOGIN TO PROCEED", }} />
      <Stack.Screen name="Register" options={{title: "CREATE YOUR ACCOUNT" }} />
      <Stack.Screen name="ConfirmScreen" options={{title: "CONFIRM SCREEN" }} />
      <Stack.Screen name="RequestScreen" options={{title: "DO YOUR MAGIC!" }} />
      <Stack.Screen name="WebBrowser" options={{ title: 'SECURE PAYFAST' }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title, }} />
    </Stack>
  );
}