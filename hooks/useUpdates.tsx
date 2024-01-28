import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { updateData, uploadFile } from '../helpers/api';
import { setActiveUser } from '../state/slices/users';
import { setConfirmDialog } from '../state/slices/ConfirmDialog';
import { pickImage, showToast, takePicture } from '../helpers/methods';
import { setAccountInfo } from '../state/slices/accountInfo';
import moment from 'moment';
import { useRouter } from 'expo-router';

const useUpdates = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const accountInfo = useSelector((state: RootState) => state.accountInfo);
    const { activeUser } = useSelector((state: RootState) => state.users);
    const handleUploadPhotos = (field:string) => {
        if(field !== "selfiePhoto"){
            dispatch(setConfirmDialog({isVisible:true,text:`Would You Like To Select From The Gallery Or You Would Like To Snap Using Your Camera?`,severity:false,okayBtn:'GALLERY',cancelBtn:'CAMERA',response:async(res:boolean) => { 
                if(res){
                    const assets: any = await pickImage(field);
                    uploadPhotos(assets,field);
                }else{
                    snapAPhoto(field)
                }
            }}))
        }else{
            //snapAPhoto(field)
            router.push({pathname:'CameraScreen',params:{type:'SELFIE',data:JSON.stringify({})}})
        }
    }
    const snapAPhoto = async(field:string) =>{
        const assets: any = await takePicture(field);
        uploadPhotos(assets,field);
    }
    const uploadPhotos = async (assets:any,field:string) => {
        let location = `${field}/${accountInfo?.clientId}`;
        if(field === "photos"){
            location = `${field}/${accountInfo?.clientId}/${(Date.now() +  Math.floor(Math.random()*89999+10000)).toString()}`;
        }
        const fileUrl = assets[0].uri;
        const url = await uploadFile(fileUrl,location)
        const photoId = (Date.now() + Math.floor(Math.random() * 899 + 1000)).toString()
        const value = [...activeUser.photos || [],{photoId,url}]
        const response = await updateData("users",accountInfo?.clientId,{field,value:field === 'photos' ? value : url})
        if(response){
            const updatedData = {...activeUser,[field] : field === 'photos' ? value : url}
            dispatch(setActiveUser(updatedData))
            dispatch(setAccountInfo(updatedData))
            showToast("Your "+field+" Has Been Successfully Changed!")
        }
    }
    const handleChange = (field:string,value:string | any) => {
        if(field == 'birthDay'){
            value = moment(value).format("L");
        }
        dispatch(setActiveUser({...activeUser,[field]:value}))
        dispatch(setAccountInfo({...activeUser,[field]:value}))
        updateData("users",(activeUser?.clientId || ''),{field,value});
    };
    return {handleUploadPhotos,handleChange};
};

export default useUpdates;
