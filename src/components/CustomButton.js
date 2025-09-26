import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS } from '../styles/globalstyle';

const { width, height } = Dimensions.get('window');

const CustomButton = ({ title, onPress = () => {}, style, textStyle }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.button, style]}
    >
      <View style={styles.row}>
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary, 
    paddingVertical: height * 0.018, 
    paddingHorizontal: width * 0.06, 
    borderRadius: width * 0.035, 
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  text: {
    color: '#fff',
    fontSize: width * 0.04, 
    fontFamily: FONTS.extraBold, 
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: width * 0.025, 
  },
});
