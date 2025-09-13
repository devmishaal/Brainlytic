import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { COLORS, globalStyles } from '../styles/globalstyle';

const { width, height } = Dimensions.get('window');

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const user = auth().currentUser;

      if (user) {
        await user.updatePassword(newPassword);
        Alert.alert('Success', 'Your password has been updated successfully');
        navigation.navigate('SignInScreen');
      } else {
        Alert.alert('Error', 'No user found. Please log in again.');
        navigation.navigate('SignInScreen');
      }
    } catch (error) {
      console.error('Reset Password Error:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: width * 0.05,
          paddingVertical: height * 0.05,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, paddingTop: height * 0.1 }}>
          <Text
            style={[
              globalStyles.titleText,
              {
                textAlign: 'center',
                fontSize: width * 0.08,
                marginBottom: height * 0.04,
              },
            ]}
          >
            Reset Password
          </Text>

          <CustomInput
            placeholder="Enter new password"
            text="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <CustomInput
            placeholder="Confirm new password"
            text="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={{ marginTop: height * 0.02 }}
          />

          <CustomButton
            title="Update Password"
            onPress={handleResetPassword}
            style={{ marginTop: height * 0.04 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({});
