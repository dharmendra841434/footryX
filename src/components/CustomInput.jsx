import {View, Text, TextInput, StyleSheet} from 'react-native';
import React from 'react';
import {appColors} from '../dummyData/appColors';

const CustomInput = ({title, placeholder, onChangeText}) => {
  return (
    <View style={{marginVertical: '5%'}}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <TextInput
          onChangeText={onChangeText}
          placeholder={placeholder}
          style={{paddingStart: 6, color: appColors.primary}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: appColors.primary,
    borderRadius: 10,
  },
  title: {
    position: 'absolute',
    fontSize: 16,
    color: appColors.primary,
    backgroundColor: 'white',
    top: -12,
    left: 15,
    paddingHorizontal: 6,
  },
});

export default CustomInput;
