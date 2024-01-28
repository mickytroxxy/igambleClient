import React, { memo, useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Col, Grid } from 'react-native-easy-grid';
import Icon from './Icon';
import { TextAreaProps } from '../../constants/Types';


const TextArea: React.FC<TextAreaProps> = memo((props) => {
  const [showPassword, setShowPassword] = useState(true);
  const [value, setValue] = useState('');
  const { attr } = props;
  return (
    <View style={{ marginTop: 10, height:attr.multiline ? 120 : 55 }}>
      <Grid style={[styles.searchInputHolder,{height:attr.multiline ? 120 : 55}]}>
        <Col size={0.15} style={{ justifyContent: 'center', alignItems: 'center',marginLeft:5 }}>
          <Icon name={attr.icon.name} type={attr.icon.type} color={attr.icon.color} size={24} />
        </Col>
        <Col style={{ justifyContent: 'center',marginLeft:5 }}>
          <TextInput
            placeholder={attr.placeholder}
            autoCapitalize="none"
            multiline={attr.multiline} 
            maxLength={1200} 
            numberOfLines={attr.multiline ? 10 : 1} 
            keyboardType={attr.keyboardType || undefined}
            onChangeText={(val) => {
              setValue(val);
              attr.handleChange(attr.field, val);
            }}
            value={attr.value || value}
            secureTextEntry={attr.field === 'password' ? showPassword : false}
            style={{ borderColor: '#fff', fontFamily: 'fontLight', fontSize: 14, color: '#757575' }}
          />
        </Col>
        <Col size={0.15} style={{ justifyContent: 'center', alignItems: 'center' }}>
          {attr.field === 'password' ? (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {!showPassword ? <Icon name="eye-off" type="Feather" color="grey" size={24} /> : <Icon name="eye" type="Feather" color="grey" size={20} />}
            </TouchableOpacity>
          ) : (
            <View>
              {value.length > (attr.icon.min || 0) && (
                <Animatable.View animation="bounceIn">
                  <Icon name="check-circle" type="Feather" color="green" size={20} />
                </Animatable.View>
              )}
            </View>
          )}
        </Col>
      </Grid>
    </View>
  );
});

const styles = StyleSheet.create({
  searchInputHolder: {
    borderRadius: 10,
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#a8a6a5',
    width: '100%',
  },
});

export default TextArea;
