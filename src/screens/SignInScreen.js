import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
} from '@react-native-firebase/auth';
import { COLORS, globalStyles } from '../styles/globalstyle';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const { width, height } = Dimensions.get('window');

const SignInScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '39170936393-e5e3c39fer1ro0gfd37amenfu1877le7.apps.googleusercontent.com',
    });
  }, []);

  const onGoogleButtonPress = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult.data?.idToken || signInResult.idToken;

      if (!idToken) throw new Error('No ID token found');

      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign in to Firebase with Google credential
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );
      const user = userCredential.user;

      // Save user details to Firestore
      await firestore()
        .collection('users')
        .doc(user.uid)
        .set(
          {
            uid: user.uid,
            email: user.email,
            username: user.displayName || '',
            photoURL: user.photoURL || '',
            provider: 'google',
            lastLogin: new Date().toISOString(),
          },
          { merge: true }, // ✅ prevents overwriting if doc already exists
        );

      // Store login state in AsyncStorage
      await AsyncStorage.setItem('@isLoggedIn', JSON.stringify(true));
    } catch (error) {
      Alert.alert('Google Sign-In failed', error.message);
    }
  };

  const handleSignIn = async () => {
    if (!email.endsWith('@gmail.com')) {
      Alert.alert('Invalid Email', 'Email must end with @gmail.com');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Invalid Password', 'Password must be at least 8 characters');
      return;
    }
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
      await AsyncStorage.setItem('@isLoggedIn', JSON.stringify(true));
      navigation.navigate('HomeScreen');
    } catch (error) {
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
        <View>
          <Text
            style={[
              globalStyles.titleText,
              { textAlign: 'center', fontSize: width * 0.08 },
            ]}
          >
            Sign In
          </Text>
          <Text
            style={[
              globalStyles.bodyText,
              {
                textAlign: 'center',
                marginBottom: height * 0.02,
                fontSize: width * 0.04,
              },
            ]}
          >
            Welcome back! You've been missed!
          </Text>

          <View style={{ paddingVertical: height * 0.02 }}>
            <CustomInput
              placeholder={'example@gmail.com'}
              text={'Email'}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <CustomInput
              placeholder={'**********'}
              text={'Password'}
              value={password}
              onChangeText={setPassword}
              isPassword={true}
              style={{ marginTop: height * 0.015 }}
            />
            <TouchableOpacity
              style={{ alignSelf: 'flex-end', marginTop: height * 0.01 }}
              onPress={() => navigation.navigate('ForgotPasswordScreen')}
            >
              <Text
                style={[
                  globalStyles.bodyText,
                  {
                    color: COLORS.primary,
                    textDecorationLine: 'underline',
                    fontSize: width * 0.035,
                  },
                ]}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <CustomButton title="Sign In" onPress={handleSignIn} />
          </View>

          <View style={{ alignItems: 'center', marginTop: height * 0.04 }}>
            <Text style={[globalStyles.bodyText, { fontSize: width * 0.035 }]}>
              Or sign in with
            </Text>

            {/* Custom Google Button */}
            <View style={{ marginTop: height * 0.02, width: '100%' }}>
              <TouchableOpacity
                style={styles.googleButton}
                onPress={onGoogleButtonPress}
              >
                <Image
                  source={require('../assets/images/google.png')}
                  style={styles.googleIcon}
                />
                <Text style={styles.googleText}>Continue with Google</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', marginTop: height * 0.025 }}>
              <Text style={globalStyles.bodyText}>Don't have an account?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignUpScreen')}
              >
                <Text
                  style={[
                    globalStyles.bodyText,
                    {
                      color: COLORS.primary,
                      marginLeft: width * 0.02,
                      textDecorationLine: 'underline',
                      fontSize: width * 0.035,
                    },
                  ]}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;

const styles = {
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: width * 0.035,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.06,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // Android shadow
  },
  googleIcon: {
    width: width * 0.06,
    height: width * 0.06,
    marginRight: width * 0.03,
  },
  googleText: {
    fontSize: width * 0.04,
    color: '#000',
    fontWeight: '500',
  },
};
