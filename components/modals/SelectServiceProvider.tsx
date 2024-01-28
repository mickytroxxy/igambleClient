import { View, Text } from 'react-native'
import React from 'react'
import UserList from '../home/UserList'
import { Button } from '../ui/Button';
import { useDispatch } from 'react-redux';
import { setModalState } from '../../state/slices/modalState';
import { colors } from '../../constants/Colors';
interface SelectorProps {
    attr:{
        handleChange:(value:any) => void;
        headerText?:string;
    }
}
export default function SelectServiceProvider(props:SelectorProps) {
    const dispatch = useDispatch();
    const {handleChange} = props.attr;
    return (
        <View style={{flex:1,padding:10}}>
            <Button 
                btnInfo={{styles:{borderRadius:10,borderColor:'#63acfa',width:'100%'}}} 
                textInfo={{text:'I WOULD LIKE TO PROVIDE MY OWN',color:colors.grey}} 
                iconInfo={{type:'AntDesign', name:'heart',color:'#63acfa',size:16}}
                handleBtnClick={() => {
                    dispatch(setModalState({isVisible:false}));
                    handleChange("MY_OWN");
                }}
            />
            <UserList from='claim'/>
        </View>
    )
}