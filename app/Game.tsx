
import React from 'react'
import { Text, View, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import * as Animatable from 'react-native-animatable';
import Icon from '../components/ui/Icon';
import { colors } from '../constants/Colors';
import { Stack, useRouter } from 'expo-router';
import { GlobalStyles } from '../styles';
import CardFlip from '../components/games/CardFlip';
import TextArea from '../components/ui/TextArea';
import useGames from '../hooks/useGames';
import { Button } from '../components/ui/Button';
import { useDispatch } from 'react-redux';
import { setBettingAmount, setGameStarted, setGameType } from '../state/slices/game';
import { currencyFormatter, showToast } from '../helpers/methods';
import { StatusBar } from 'expo-status-bar';
import { setConfirmDialog } from '../state/slices/ConfirmDialog';
import WheelOfFortune from '../components/games/WheelOfFortune';
import { AppProvider } from '../state/context';

const Game = () => {
  const dispatch = useDispatch();
  const {gameTypes,gameType,accountInfo,bettingAmount,gameStarted,handleShowPackages,gamblingItems,isGameOver,flipCard,currentAmount} = useGames();
  return(
    <View style={GlobalStyles.container}>
        <StatusBar style='light' />
        <Stack.Screen options={{ 
            title:gameType.category, 
            headerRight: () => (
                <View><Text style={{fontFamily:'fontBold',color:colors.white,fontSize:11}}>{currencyFormatter(currentAmount)}</Text></View>
            )
        }} />
        {gamblingItems.length > 0 && <AppProvider>{gameType.category === "LUCKY CARD" ? <CardFlip/> : <WheelOfFortune bettingAmount={bettingAmount} currentAmount={currentAmount}  flipCard={flipCard} isGameOver={isGameOver} gameStarted={gameStarted} gamblingItems={gamblingItems}/>}</AppProvider>}
        <LinearGradient colors={["#f9f1ed","#f3f9fe","#faf8fa","#f7f3d0"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{backgroundColor:'#f9f1ed',justifyContent:'center',padding:10,borderTopLeftRadius:10,borderTopRightRadius:10,paddingBottom:Platform.OS === 'ios' ? 30 : 10}}>
            <View style={{flexDirection:'row'}}>
                <View style={{flex:1}}>
                    <TextArea attr={{field:'money',icon:{name:'money',type:'FontAwesome',min:5,color:'#5586cc'},keyboardType:'numeric',placeholder:'ENTER YOUR BETTING AMOUNT',color:'#009387',handleChange:(field:any,value:any) => {
                        dispatch(setBettingAmount(value))
                    }}} />
                </View>
                <View style={{justifyContent:'center'}}>
                    <TouchableOpacity onPress={handleShowPackages}>
                        <Icon type='AntDesign' name="gift" size={40} color={colors.orange} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{width:'100%',flexDirection:'row',justifyContent:'space-around'}}>
                {gameTypes?.map((item,i) =>
                    <View style={{flex:1}} key={i}>
                        <Button 
                            btnInfo={{styles:{borderRadius:5,borderColor:colors.orange,width:'99%',backgroundColor:item.selected ? '#F9B030' : colors.white,padding:5}}} 
                            textInfo={{text:item.category,color: !item.selected ? '#F9B030' : colors.white}} 
                            iconInfo={{type: item.category === 'LUCKY CARD' ? 'MaterialCommunityIcons' : 'FontAwesome', name: item.category === 'WHEEL OF FORTUNE' ? 'spinner' : 'cards-playing',color:!item.selected ? '#F9B030' : colors.white,size:30}}
                            handleBtnClick={() => {
                                dispatch(setGameType(gameTypes.map(data => data.category === item.category ? {...data,selected:true} : {...data,selected:false})))
                            }}
                        />
                    </View>
                )}
            </View>
            <View>
                <Button 
                    btnInfo={{styles:{borderRadius:5,borderColor:colors.green,width:'99%',backgroundColor:colors.white,padding:5}}} 
                    textInfo={{text:!gameStarted ? 'START GAME' : 'GAME STARTED!',color: colors.green}} 
                    iconInfo={{type: 'MaterialCommunityIcons', name: 'clock-start',color:colors.green,size:30}}
                    handleBtnClick={() => {
                        if(!gameStarted){
                            if(currentAmount >= bettingAmount){
                                dispatch(setConfirmDialog({isVisible: true,text: `You are about to start a ${gameType.category} GAME, your betting amount is ${currencyFormatter(bettingAmount)}.\n\nINSTRUCTIONS\nYou only have 1 chance to pick a card that you think has a good package`,okayBtn: 'START',cancelBtn: 'Cancel',severity: true,response: async(res:boolean) => {
                                    if (res) {
                                        dispatch(setGameStarted(!gameStarted));
                                        if(gameType.category === 'LUCKY CARD'){
                                            showToast("You can now choose your luck card");
                                        }else{
                                            showToast("You can now spin the wheel");
                                        }
                                    }
                                }}));
                            }else{
                                showToast("You don't have enough funds to play at this time!")
                            }
                        }else{
                            dispatch(setConfirmDialog({isVisible: true,text: `The game is in progress, do you want to end now?`,okayBtn: 'STOP_GAME',cancelBtn: 'Cancel',severity: true,response: async(res:boolean) => {
                                if (res) {
                                    dispatch(setGameStarted(!gameStarted));
                                }
                            }}));
                        }
                    }}
                />
            </View>
        </LinearGradient>
    </View>
  )
}
export default Game