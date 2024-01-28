import React from 'react';
import {
  StyleSheet,
  View,
  Text as RNText,
  Dimensions,
  Animated
} from 'react-native';
import * as d3Shape from 'd3-shape';
import color from 'randomcolor';
import { snap } from '@popmotion/popcorn';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Svg, Path, G, TSpan, Text } from 'react-native-svg';
import { AppContext } from '../../state/context';
import { showToast } from '../../helpers/methods';
import { colors } from '../../constants/Colors';
import Icon from '../ui/Icon';
const { width } = Dimensions.get('screen');


const numberOfSegments = 9;
const wheelSize = width * 0.95;
const fontSize = 11;
const oneTurn = 360;
const angleBySegment = oneTurn / numberOfSegments;
const angleOffset = angleBySegment / 2;
const knobFill = color({ hue: 'purple' });

const makeWheel = (gamblingItems) => {
  const data = Array.from({ length: numberOfSegments }).fill(1);
  const arcs = d3Shape.pie()(data);
  const colors = color({luminosity: 'dark',count: numberOfSegments});
  return arcs.map((arc, index) => {
    const instance = d3Shape.arc().padAngle(0.01).outerRadius(width / 2).innerRadius(20);
    return {
      path: instance(arc),
      color: colors[index],
      centroid: instance.centroid(arc),
      value: gamblingItems?.[index]?.class
    };
  });
};

export default class WheelOfFortune extends React.Component {
  _gamblingItems = null;
  _wheelPaths = null
  _angle = new Animated.Value(0);
  angle = 0;

  state = {
    enabled: true,
    finished: false,
    winner: null
  };
  static contextType = AppContext;
  componentDidMount() {
    this._angle.addListener(event => {
      if (this.state.enabled) {
        this.setState({
          enabled: false,
          finished: false
        });
      }

      this.angle = event.value;
    });
  }
  _getWinnerIndex = () => {
    const deg = Math.abs(Math.round(this.angle % oneTurn));
    if (this.angle < 0) {
      return Math.floor(deg / angleBySegment);
    }
    return (numberOfSegments - Math.floor(deg / angleBySegment)) % numberOfSegments;
  };

  _onPan = ({ nativeEvent }) => {
    if(this.props.currentAmount >= this.props.bettingAmount){
      if (this.props.gameStarted) {
        if (nativeEvent.state === State.END) {
          const { velocityY } = nativeEvent;
          const minSpinVelocity = 2000;
          if (Math.abs(velocityY) > minSpinVelocity) {
            Animated.decay(this._angle, {
              velocity: velocityY / 1000,
              deceleration: 0.999,
              useNativeDriver: true,
            }).start(() => {
              this._angle.setValue(this.angle % oneTurn);
              const snapTo = snap(oneTurn / numberOfSegments);
              Animated.timing(this._angle, {
                toValue: snapTo(this.angle),
                duration: 300,
                useNativeDriver: true,
              }).start(() => {
                const winnerIndex = this._getWinnerIndex();
                this.setState({enabled: true,finished: true,winner: this._wheelPaths[winnerIndex].value});
                const selectedItem = this._gamblingItems?.filter(item => item.class === this._wheelPaths[winnerIndex].value)[0];
                this.props.flipCard(selectedItem);
              });
            });
          } else {
            showToast("Please spin with more speed for the spin to register!");
          }
        }
      } else {
        showToast("Please start the game to proceed!");
      }
    }else{
      showToast("You have run out of funds!")
    }
  };
  
  render() {
    return (
      <PanGestureHandler onHandlerStateChange={this._onPan} enabled={this.state.enabled}>
        <View style={styles.container}>
          {this._renderSvgWheel()}
          {this.state.finished && this.state.enabled && this._renderWinner()}
        </View>
      </PanGestureHandler>
    );
  }

  _renderKnob = () => {
    const knobSize = 30;
    const YOLO = Animated.modulo(
      Animated.divide(
        Animated.modulo(Animated.subtract(this._angle, angleOffset), oneTurn),
        new Animated.Value(angleBySegment)
      ),
      1
    );

    return (
      <Animated.View
        style={{
          width: knobSize,
          height: knobSize * 2,
          justifyContent: 'flex-end',
          zIndex: 1,
          transform: [
            {
              rotate: YOLO.interpolate({
                inputRange: [-1, -0.5, -0.0001, 0.0001, 0.5, 1],
                outputRange: ['0deg', '0deg', '35deg', '-35deg', '0deg', '0deg']
              })
            }
          ]
        }}
      >
        <Svg
          width={knobSize}
          height={(knobSize * 100) / 57}
          viewBox={`0 0 57 100`}
          style={{ transform: [{ translateY: 8 }] }}
        >
          <Path
            d="M28.034,0C12.552,0,0,12.552,0,28.034S28.034,100,28.034,100s28.034-56.483,28.034-71.966S43.517,0,28.034,0z   M28.034,40.477c-6.871,0-12.442-5.572-12.442-12.442c0-6.872,5.571-12.442,12.442-12.442c6.872,0,12.442,5.57,12.442,12.442  C40.477,34.905,34.906,40.477,28.034,40.477z"
            fill={knobFill}
          />
        </Svg>
      </Animated.View>
    );
  };

  _renderWinner = () => {
    return (
      <View style={{alignItems:'center',position:'absolute',top:10}}>
        <RNText style={{fontSize: 12,fontFamily: 'fontBold',color:colors.grey}}>{this.state.winner}</RNText>
        {this.state.winner !== "UNFORTUNATE" && <View style={{flexDirection:'row'}}>{[1,2,3,4,5,6,7,8,9,10].map((item) => <View key={item} style={{width:'10%',alignItems:'center'}}><Icon type='MaterialIcons' name="star" size={18} color={colors.orange} /></View>)}</View>}
      </View>
    );
  };
  _renderSvgWheel = () => {
    const { gamblingItems } = this.props;
    this._gamblingItems = gamblingItems;
    this._wheelPaths = makeWheel(gamblingItems);
    return (
      <View style={styles.container}>
        {this._renderKnob()}
        <Animated.View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            transform: [
              {
                rotate: this._angle.interpolate({
                  inputRange: [-oneTurn, 0, oneTurn],
                  outputRange: [`-${oneTurn}deg`, `0deg`, `${oneTurn}deg`]
                })
              }
            ]
          }}
        >
          <Svg width={wheelSize} height={wheelSize} viewBox={`0 0 ${width} ${width}`} style={{ transform: [{ rotate: `-${angleOffset}deg` }] }}>
            <G y={width / 2} x={width / 2}>
              {this._wheelPaths.map((arc, i) => {
                const [x, y] = arc.centroid;
                const number = arc?.value?.toString();
  
                return (
                  <G key={`arc-${i}`}>
                    <Path d={arc.path} fill={arc.color} />
                    <G rotation={(i * oneTurn) / numberOfSegments + angleOffset} origin={`${x}, ${y}`}>
                      <Text
                        x={x}
                        y={y - 70}
                        fill="white"
                        textAnchor="middle"
                        fontSize={fontSize}
                        fontWeight={500}
                        sty
                      >
                        {Array.from({ length: number?.length }).map((_, j) => {
                          return (
                            <TSpan
                              x={x}
                              dy={fontSize}
                              key={`arc-${i}-slice-${j}`}
                            >
                              {number?.charAt(j)}
                            </TSpan>
                          );
                        })}
                      </Text>
                    </G>
                  </G>
                );
              })}
            </G>
          </Svg>
        </Animated.View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#FFD6D0',
    alignItems: 'center',
    justifyContent: 'center'
  },
});