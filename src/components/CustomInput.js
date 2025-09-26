import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { COLORS, FONTS } from '../styles/globalstyle';

const { width, height } = Dimensions.get('window');

const CustomInput = ({
   placeholder,
  placeholderTextColor = COLORS.textSecondary,
  keyboardType,
  text,
  value,
  onChangeText,
  secureTextEntry,
  isPassword = false,
  multiline = false,
  style,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={{ marginBottom: height * 0.015 }}>
      <Text style={styles.label}>{text}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !showPassword}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <Eye size={width * 0.05} color={COLORS.textSecondary} />
            ) : (
              <EyeOff size={width * 0.05} color={COLORS.textSecondary} />
            )}
          </TouchableOpacity>
        )}
        
      </View>
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  label: {
    fontFamily: FONTS.medium,
    fontSize: width * 0.04, 
    color: COLORS.textPrimary,
    marginBottom: height * 0.005, 
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: width * 0.04, 
    paddingVertical: height * 0.004, 
    borderRadius: width * 0.035, 
    backgroundColor: COLORS.cardBackground,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontFamily: FONTS.regular,
    fontSize: width * 0.04, 
    color: COLORS.textPrimary,
  },
});
