import React, { memo, useContext, useState } from 'react'
import { View, TouchableOpacity, Text, Dimensions, ScrollView, Image, Modal } from 'react-native'
import { Ionicons, MaterialIcons,Feather,FontAwesome } from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useDispatch } from 'react-redux';
import { setConfirmDialog } from '../../../state/slices/ConfirmDialog';
import { showToast } from '../../../helpers/methods';
import { UserProfile } from '../../../constants/Types';
import { GlobalStyles } from '../../../styles';
import useUpdates from '../../../hooks/useUpdates';


interface PhotoProps {
    data?: {
      profileOwner?: boolean;
      activeProfile?: UserProfile;
    };
}
const {width,height} = Dimensions.get("screen");

const Photos: React.FC<PhotoProps> = memo((props) => {
    const {profileOwner,activeProfile} = props?.data || {};
    const {handleUploadPhotos} = useUpdates();
    let photosArray = [...activeProfile?.photos || []];
    const [photoBrowserVisible, setPhotoBrowserVisible] = useState(false);
    return (
        <Animatable.View animation="bounceIn" duration={1000} useNativeDriver={true} style={{padding:5 }}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {photosArray.length > 0 && photosArray.map((item, i) => (
                    <TouchableOpacity key={i} onPress={()=>{
                            photosArray.unshift(photosArray.splice(i, 1)[0]);
                            setPhotoBrowserVisible(true)
                        }}>
                        <View style={GlobalStyles.mediaImageContainer}>
                            <Animatable.Image animation="zoomInDown" duration={2000} useNativeDriver={true} source={{uri:item.url}} style={GlobalStyles.image} resizeMode="cover"></Animatable.Image>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            {(profileOwner && photosArray.length > 0) &&
                <LinearGradient colors={["#e44528","#d6a8e7","#f3bf4f"]}start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={[GlobalStyles.mediaCount]}>
                    <TouchableOpacity onPress={()=>handleUploadPhotos('photos')}>
                        <MaterialIcons name="add-circle" size={30} color="#fff" alignSelf="center"></MaterialIcons>
                    </TouchableOpacity>
                </LinearGradient>
            }
            
            
            <Modal visible={photoBrowserVisible} transparent={true} animationType="fade">
                <ImageViewer 
                    imageUrls={photosArray.map(item => ({url:item.url}))} 
                    enableSwipeDown={true} 
                    onSwipeDown={()=>setPhotoBrowserVisible(false)}  
                    renderFooter={(index) => <PhotoFooter photoData={{setPhotoBrowserVisible,index,photosArray,profileOwner}}/>}
                    footerContainerStyle={{}}
                />
            </Modal>
        </Animatable.View>
    )
})

type PhotoData = {
  setPhotoBrowserVisible: (visible: boolean) => void;
  index: number;
  photosArray: any[];
  profileOwner: boolean | any;
};

type Props = {
  photoData: PhotoData;
};

const PhotoFooter: React.FC<Props> = (props) => {
    const { setPhotoBrowserVisible, index, photosArray, profileOwner } = props.photoData;
    const dispatch = useDispatch(); 
    const {handleChange} = useUpdates();
    return (
        <View style={{ flexDirection: 'row', padding: 15 }}>
        <TouchableOpacity
            style={{ marginLeft: !profileOwner ? width / 2 - 33 : 0 }}
            onPress={() => {
            setPhotoBrowserVisible(false);
            }}
        >
            <FontAwesome name="remove" color="#fff" size={48} />
        </TouchableOpacity>
        {profileOwner && (
            <TouchableOpacity
                style={{ marginLeft: width - 110 }}
                onPress={() => {
                    dispatch(setConfirmDialog({isVisible: true,text: `Are you sure you want to delete this photo? This cannot be undone!`,okayBtn: 'Cancel',cancelBtn: 'Delete',severity: true,response: (res:boolean) => {
                        if (!res) {
                            const photos = photosArray.filter((item, i) => i !== index);
                            handleChange('photos', photos);
                            showToast('Photo deleted');
                            setPhotoBrowserVisible(false);
                        }
                    }}));
                }}
            >
                <MaterialIcons name="delete-forever" color="tomato" size={48} />
            </TouchableOpacity>
        )}
        </View>
    );
};

export default Photos