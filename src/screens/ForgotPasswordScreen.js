import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { COLORS, globalStyles } from '../styles/globalstyle';

const { width, height } = Dimensions.get('window');

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Please enter your email.');
      return;
    }

    try {
      await auth().sendPasswordResetEmail(email);
      navigation.navigate('PasswordResetVerificationScreen', { email });
    } catch (error) {
      console.error('Forgot Password Error:', error);
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
                marginBottom: height * 0.02,
              },
            ]}
          >
            Forgot Password
          </Text>
          <Text
            style={[
              globalStyles.bodyText,
              {
                textAlign: 'center',
                marginBottom: height * 0.03,
                fontSize: width * 0.04,
              },
            ]}
          >
            Enter your registered email below to receive password reset
            instructions.
          </Text>

          <CustomInput
            placeholder="example@gmail.com"
            text="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <CustomButton
            title="Send Reset Link"
            onPress={handleResetPassword}
            style={{ marginTop: height * 0.03 }}
          />

          <TouchableOpacity
            style={{ marginTop: height * 0.03, alignItems: 'center' }}
            onPress={() => navigation.navigate('SignInScreen')}
          >
            <Text
              style={[
                globalStyles.bodyText,
                { color: COLORS.primary, fontSize: width * 0.04 },
              ]}
            >
              Back to Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({});
