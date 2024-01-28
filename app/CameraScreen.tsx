import React, {useContext, useEffect, useRef, useState } from 'react';
import {StyleSheet,View,Text,Dimensions,ActivityIndicator,SafeAreaView} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FaceDetector from 'expo-face-detector';
import * as Animatable from 'react-native-animatable';
import { Camera, CameraType } from 'expo-camera';
import { Stack, useRouter, useSearchParams } from 'expo-router';
import useUsers from '../hooks/useUsers';
import { createData, updateData, uploadFile } from '../helpers/api';
import { useDispatch } from 'react-redux';
import { setAccountInfo } from '../state/slices/accountInfo';
import { showToast } from '../helpers/methods';
import { AppContext } from '../state/context';
import { setModalState } from '../state/slices/modalState';
import useMessages from '../hooks/useMessages';
const { height, width } = Dimensions.get('screen');
const { width: windowWidth } = Dimensions.get('window');

const PREVIEW_SIZE = 300;
const PREVIEW_RECT = {
  minX: (windowWidth - PREVIEW_SIZE) / 2,
  minY: 50,
  width: PREVIEW_SIZE,
  height: PREVIEW_SIZE,
};

export default function CameraScreen() {
    const {accountInfo,activeUser} = useUsers();
    const {onSend} = useMessages();
    const paramData = useSearchParams();
    const {type,data} = paramData;
    const obj: { [key: string]: any } = JSON.parse(data as string);
    const [propsFaceDetector, setPropsFaceDetector] = useState<any>({});
    const router = useRouter();
    const dispatch = useDispatch();
    const selfieResponse = async(fileUrl:string) => {
        let location = `selfiePhoto/${accountInfo?.clientId}`;
        router.back();
        const url = await uploadFile(fileUrl,location);
        if(type === 'REQUEST'){
          handleRequest(url);
        }
        await updateData("users",accountInfo.clientId,{value:url,field:'selfiePhoto'})
        dispatch(setAccountInfo({...accountInfo,selfiePhoto:url}));
        showToast("Your selfie has been updated!");
    };
    const handleRequest = async(selfiePhoto:string) => {
        const {connectionId} = obj;
        const response = await createData("requests",connectionId,{...obj,selfiePhoto});
        if(response){
            const message = `Hi ${activeUser.fname}, You have a new ${obj.service} REQUEST from ${accountInfo.fname}, Click on their profile to respond`
            const _id:string = accountInfo.fname?.toUpperCase().slice(0, 2) + Math.floor(Math.random() * 8999999999 + 10000009999).toString();
            onSend([{text:message,_id}]);
            showToast("You have successfully placed your request. ");
            dispatch(setModalState({isVisible:true,attr:{headerText:'SUCCESS STATUS',message:'You have successfully placed your request. ',status:true}}));
        }
    }
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [camera, setCamera] = useState<Camera | null>(null);
    const [detections, setDetections] = useState<any[]>([
        { type: 'BLINK', instruction: 'Blink both eyes', minProbability: 0.3, completed: false },
        { type: 'BLINK_RIGHT_EYE', instruction: 'Close right eye', minProbability: 0.3, completed: false },
        { type: 'TURN_HEAD_LEFT', instruction: 'Turn head left', maxAngle: 20, completed: false },
        { type: 'TURN_HEAD_RIGHT', instruction: 'Turn head right', minAngle: -2, completed: false },
        { type: 'SMILE', instruction: 'Smile', minProbability: 0.7, completed: false },
    ]);
    const currentIndexRef = useRef<number>(0);
    const [instructions, setInstructions] = useState<{ status: boolean; text: string }>({status: false,text: 'Position your face in the circle and then'});
    const currentDetection = detections[currentIndexRef.current < 5 ? currentIndexRef.current : 4];
    const progress = currentIndexRef.current * 20;
    const handleIndex = (index: number) => {
      currentIndexRef.current = index;
      if (index === 5) {
        takePicture();
      }
    };

    useEffect(() => {
        async function getCameraStatus() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        setHasCameraPermission(status === 'granted');
        }
        getCameraStatus();
    }, []);

  const onFacesDetected = (result: any) => {
    const currentDetection = detections[currentIndexRef.current < 5 ? currentIndexRef.current : 4];
    console.log(currentIndexRef.current)
    if (result.faces.length !== 1) {
      currentIndexRef.current = 0;
      setInstructions({ status: false, text: 'Position your face in the circle and then' });
      return;
    }

    const face = result.faces[0];
    const faceRect = {
      minX: face.bounds.origin.x,
      minY: face.bounds.origin.y,
      width: face.bounds.size.width,
      height: face.bounds.size.height,
    };
    const edgeOffset = 50;
    const faceRectSmaller = {
      width: faceRect.width - edgeOffset,
      height: faceRect.height - edgeOffset,
      minY: faceRect.minY + edgeOffset / 2,
      minX: faceRect.minX + edgeOffset / 2,
    };
    const previewContainsFace = contains({ outside: PREVIEW_RECT, inside: faceRectSmaller });

    if (!previewContainsFace) {
      setInstructions({ status: false, text: 'Position your face in the circle and then' });
      return;
    }

    const faceMaxSize = PREVIEW_SIZE - 90;

    if (faceRect.width >= faceMaxSize && faceRect.height >= faceMaxSize) {
      setInstructions({ status: false, text: "You're too close. Hold the device further and then" });
      return;
    }

    if (previewContainsFace && !(faceRect.width >= faceMaxSize && faceRect.height >= faceMaxSize)) {
      if (!instructions.status) {
        setInstructions({ status: true, text: 'Keep the device still and perform the following actions:' });
      }
    }

    
    if (currentDetection.type === 'BLINK') {
      const leftEyeClosed = face.leftEyeOpenProbability <= currentDetection.minProbability;
      const rightEyeClosed = face.rightEyeOpenProbability <= currentDetection.minProbability;
      if (leftEyeClosed && rightEyeClosed) {
        handleIndex(1);
      }
    }
    if (currentDetection.type === 'BLINK_RIGHT_EYE') {
      console.log(face.leftEyeOpenProbability , currentDetection.minProbability)
      const leftEyeClosed = face.leftEyeOpenProbability <= currentDetection.minProbability;
      const rightEyeClosed = face.rightEyeOpenProbability <= currentDetection.minProbability;
      if (leftEyeClosed && !rightEyeClosed) {
        handleIndex(2);
      }
    }

    if (currentDetection.type === 'TURN_HEAD_RIGHT') {
      if (face.yawAngle < 60) {
        handleIndex(4);
      }
    }

    if (currentDetection.type === 'TURN_HEAD_LEFT') {
      if (face.yawAngle >= 150) {
        handleIndex(3);
      }
    }

    if (currentDetection.type === 'SMILE') {
      if (face.smilingProbability > 0.5) {
        handleIndex(5);
      }
    }
  };

  const takePicture = async () => {
    if (camera) {
      const result = await camera.takePictureAsync(null || undefined);

      await ImageManipulator.manipulateAsync(result.uri, [{ resize: { width: width * 2, height: height * 2 } }], {
        compress: 0.4,
        format: ImageManipulator.SaveFormat.PNG,
        base64: false,
      }).then(async (result) => {
        selfieResponse(result.uri);
      });
    }
  };

  function contains({ outside, inside }: { outside: any; inside: any }): boolean {
    const outsideMaxX = outside.minX + outside.width;
    const insideMaxX = inside.minX + inside.width;

    const outsideMaxY = outside.minY + outside.height;
    const insideMaxY = inside.minY + inside.height;

    if (inside.minX < outside.minX) {
      return false;
    }
    if (insideMaxX > outsideMaxX) {
      return false;
    }
    if (inside.minY < outside.minY) {
      return false;
    }
    if (insideMaxY > outsideMaxY) {
      return false;
    }
    
    return true;
  }
  
  if (hasCameraPermission === null) {
    return (
      <View style={styles.information}>
        <ActivityIndicator size="large" color="#757575" />
      </View>
    );
  } else if (hasCameraPermission === false) {
    return (
      <View style={styles.information}>
        <Text>No access tocamera</Text>
      </View>
    );
  } else {
    return (
      <SafeAreaView style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }]}>
        <Stack.Screen options={{title:'VERIFICATION PHOTO'}} />
        <View style={{ height: 300, width: 300, borderRadius: 200, overflow: 'hidden' }}>
          <Animatable.View>
            <Camera
              type={CameraType.front}
              whiteBalance={8}
              style={{ height: 380, width: 300 }}
              {...propsFaceDetector}
              onCameraReady={() => {
                setPropsFaceDetector({
                  onFacesDetected: onFacesDetected,
                  faceDetectorSettings: {
                    mode: FaceDetector.FaceDetectorMode.fast,
                    minDetectionInterval: 500,
                    detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
                    runClassifications: FaceDetector.FaceDetectorClassifications.all,
                    tracking: false,
                  },
                });
              }}
              ref={(ref) => {
                setCamera(ref);
              }}
            >
              <AnimatedCircularProgress
                size={300}
                width={5}
                backgroundWidth={7}
                fill={progress}
                tintColor="green"
                backgroundColor="#e8e8e8"
              />
            </Camera>
          </Animatable.View>
        </View>
        <View style={{ marginTop: 30 }}>
          <Text style={{ fontFamily: 'fontLight', textAlign: 'center' }}>{instructions.text}</Text>
          <Text style={{ fontFamily: 'fontBold', marginTop: 20, textAlign: 'center' }}>{currentDetection.instruction}</Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  information: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  cameraPreview: {
    flex: 1,
  },
  cameraActionView: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  mask: {
    borderRadius: PREVIEW_SIZE / 2,
    height: PREVIEW_SIZE,
    width: PREVIEW_SIZE,
    marginTop: PREVIEW_RECT.minY,
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  circularProgress: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    marginTop: PREVIEW_RECT.minY,
    marginLeft: PREVIEW_RECT.minX,
  },
  instructions: {
    fontSize: 20,
    textAlign: 'center',
    top: 25,
    position: 'absolute',
  },
  instructionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: PREVIEW_RECT.minY + PREVIEW_SIZE,
  },
  action: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});