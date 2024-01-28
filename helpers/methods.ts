import { Alert, Linking, Platform, ToastAndroid } from "react-native";
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-root-toast';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { updateData } from "./api";
export {Notifications}
Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
});
export const showToast = (message: string): void => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.LONG);
  } else {
    let toast = Toast.show(message, {
      duration: Toast.durations.LONG,
    });
  }
};

export const sendSms = (phoneNo: string, msg: string): void => {
  const request = new XMLHttpRequest();
  request.open('POST', 'https://rest.clicksend.com/v3/sms/send');
  request.setRequestHeader('Content-Type', 'application/json');
  request.setRequestHeader('Authorization', 'Basic aW5mb0BlbXBpcmVkaWdpdGFscy5vcmc6ZW1waXJlRGlnaXRhbHMxIUA=');
  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      showToast(`Message sent to ${phoneNo}`);
    }
  };

  const body = {
    'messages': [
      {
        'source': 'javascript',
        'from': "uberFlirt",
        'body': msg,
        'to': phoneNo,
        'schedule': '',
        'custom_string': ''
      }
    ]
  };

  request.send(JSON.stringify(body));
};

export const phoneNoValidation = (phone: string, countryCode: string): string | false => {
  countryCode = countryCode.slice(1, countryCode.length);
  let phoneNumber = phone.replace(/ /g, '');

  if (phoneNumber.length < 16 && phoneNumber.length > 7) {
    if (phoneNumber[0] === "0" && phoneNumber[1] !== "0") {
      phoneNumber = phoneNumber.slice(1);
    } else if (phoneNumber[0] !== '0') {
      phoneNumber = phoneNumber;
    }

    if (countryCode !== "") {
      if (countryCode[0] === "+") {
        countryCode = countryCode.slice(1);
      } else {
        if (countryCode[0] === "0" && countryCode[1] === "0") {
          countryCode = countryCode.slice(2);
        }
      }
      return countryCode + phoneNumber;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const nativeLink = (type: string, obj: { lat?: number; lng?: number; label?: string; phoneNumber?: string; email?: string }): void => {
    if (type === 'map') {
      const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
      const latLng = `${obj.lat},${obj.lng}`;
      const label = obj.label;
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`
      }) as string; // Type assertion here
      Linking.openURL(url);
    } else if (type === 'call') {
      let phoneNumber = obj.phoneNumber;
      if (Platform.OS !== 'android') {
        phoneNumber = `telprompt:${obj.phoneNumber}`;
      } else {
        phoneNumber = `tel:${obj.phoneNumber}`;
      }
      Linking.canOpenURL(phoneNumber)
        .then((supported) => {
          if (!supported) {
            Alert.alert('Phone number is not available');
          } else {
            return Linking.openURL(phoneNumber || '');
          }
        })
        .catch((err) => console.log(err));
    } else if (type === 'email') {
      Linking.openURL(`mailto:${obj.email}`);
    }
};
  

export const sendPushNotification = async (to: string | null | undefined, title: string, body: string, data: any): Promise<void> => {
  if (to) {
    const message = {to,sound: 'default',title,body,data,priority: 'high'};
    try {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    } catch (error) {
      // Handle error
    }
  }
};

export const getDistance = (lat1: number, lon1: number, lat2: number | any, lon2: number | any): number => {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const radLat1 = toRad(lat1);
    const radLat2 = toRad(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return d;
};

const toRad = (value: number): number => {
    return value * Math.PI / 180;
};
export const takePicture = async (type:string) => {
  try {
      const permissionRes = await ImagePicker.requestCameraPermissionsAsync();
      const { granted } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
      if(granted || permissionRes.granted){
          let result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              base64:false,
              aspect: type === "avatar" ? [1, 1] : undefined,
              quality: 0.5,
          });
          if (!result.canceled) {
            return result.assets
          }
      }
  } catch (error) {
      alert(JSON.stringify(error))
  }
}
export const currencyFormatter = (amount:any) => `ZAR ${parseFloat(amount).toFixed(2)}`
export const pickImage = async (type:string) => {
  try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if(permissionResult.granted){
          let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              base64:false,
              aspect: type=="avatar"?[1, 1] : undefined,
              quality: 0.5,
          });
          if (!result.canceled) {
            return result.assets
          }
      }
  } catch (error) {
    showToast('Something went wrong')
  }
};

export const registerForPushNotificationsAsync = async(clientId:any)=> {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return;
    }
    await Notifications.getExpoPushTokenAsync().then((res) => {
      const notificationToken = res.data;
      if(clientId){
        updateData("users",clientId,{value:notificationToken,field:'notificationToken'})
      }
    })
  } else {
    showToast('Must use physical device for Push Notifications');
  }
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return token;
}