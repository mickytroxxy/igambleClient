import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, ImageBackground, ScrollView, Platform, FlatList } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { colors } from '../../constants/Colors';
import Icon from '../ui/Icon';
import useGames from '../../hooks/useGames';
const {width} = Dimensions.get("screen")
//Interaction manager
  
const CardFlip: React.FC = () => {
    const {gamblingItems,flipCard} = useGames();
    
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.cardGrid}>
                    {gamblingItems.length > 0 && gamblingItems.map((item,i) => {
                        return(
                            <TouchableOpacity key={i} onPress={() => flipCard(item)}>
                                <Animatable.View animation={item.selected ? 'zoomInUp' : 'zoomIn'} duration={2000} style={[styles.cardContainer, item.selected && styles.selectedCard]}>
                                    {!item.selected && <ImageBackground imageStyle={{ borderRadius: 10}} source={require('../../assets/images/backcard1.png')} resizeMode='cover' style={{flex:1,width:'100%'}}></ImageBackground>}
                                    {item.selected && 
                                        <View style={{backgroundColor:colors.white,flex:1,justifyContent:'center',alignItems:'center',margin:5,width:'92%',borderRadius:10}}>
                                            <Text style={{fontFamily:'fontBold',fontSize:11,color:colors.orange}}>{item.class}</Text>
                                            <Icon type='FontAwesome' name='star' color={colors.orange} size={70} />
                                        </View>
                                    }
                                </Animatable.View>
                            </TouchableOpacity>
                        )
                    })}
                </View>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',flex:1,backgroundColor:'#FFD6D0'
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    justifyContent:'space-between',
    padding:10,
    flex:1
  },
  cardContainer: {
    width: width / 3.1 - 5,
    height: Platform.OS === 'android' ? 180 : 200,
    marginTop:10,
    backgroundColor: '#FFAEA2',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:10

  },
  selectedCard: {
    backgroundColor: '#FFAEA2',
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    color: 'white',
    fontSize: 20,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  ladiesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lady: {
    padding: 10,
    backgroundColor: 'pink',
    marginHorizontal: 5,
  },
  ladyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CardFlip;
