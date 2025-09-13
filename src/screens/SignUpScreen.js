import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { COLORS, globalStyles } from '../styles/globalstyle';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';

const { width, height } = Dimensions.get('window');

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUserName] = useState('');

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

      // Sign in with Firebase using Google credential
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
            createdAt: new Date().toISOString(),
          },
          { merge: true },
        );

      // Store login status locally
      await AsyncStorage.setItem('@isLoggedIn', JSON.stringify(true));
    } catch (error) {
      Alert.alert('Google Sign-In failed', error.message);
    }
  };

  const SignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert('Fill all fields!');
      return;
    }

    if (!email.endsWith('@gmail.com')) {
      Alert.alert('Email must end with @gmail.com');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Password must be at least 8 characters');
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = userCredential.user;

      await firestore().collection('users').doc(user.uid).set({
        uid: user.uid,
        username: username,
        email: email,
        createdAt: new Date().toISOString(),
      });

      await AsyncStorage.setItem('@isLoggedIn', JSON.stringify(true));

      Alert.alert('Account Created Successfully!');
      navigation.navigate('SignInScreen');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[globalStyles.container, { paddingHorizontal: width * 0.04 }]}
        >
          <Text
            style={[
              globalStyles.titleText,
              {
                textAlign: 'center',
                fontSize: width * 0.08,
                marginTop: height * 0.06,
              },
            ]}
          >
            Create Account
          </Text>
          <Text
            style={[
              globalStyles.bodyText,
              { textAlign: 'center', fontSize: width * 0.04 },
            ]}
          >
            Fill your information below or register with your social account.
          </Text>

          <View style={{ paddingVertical: height * 0.02 }}>
            <CustomInput
              placeholder={'johndoe'}
              text={'Username'}
              value={username}
              onChangeText={setUserName}
            />
            <CustomInput
              placeholder={'example@gmail.com'}
              text={'Email'}
              keyboardType={'email-address'}
              value={email}
              onChangeText={setEmail}
              style={{ marginTop: height * 0.015 }}
            />
            <CustomInput
              placeholder={'**********'}
              text={'Password'}
              value={password}
              onChangeText={setPassword}
              isPassword={true}
              style={{ marginTop: height * 0.015 }}
            />

            <CustomButton title={'Sign Up'} onPress={SignUp} />
          </View>

          <View style={{ alignItems: 'center', marginTop: height * 0.03 }}>
            <Text style={[globalStyles.bodyText, { fontSize: width * 0.035 }]}>
              Or sign up with
            </Text>

            {/* Custom Google Button (same as SignIn) */}
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
              <Text style={globalStyles.bodyText}>
                Already have an account?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignInScreen')}
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
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{ marginTop: height * 0.015 }}
              onPress={() => navigation.navigate('TermandConditions')}
            >
              <Text
                style={[
                  globalStyles.bodyText,
                  { textDecorationLine: 'underline', fontSize: width * 0.035 },
                ]}
              >
                Terms & Conditions
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
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
    elevation: 2,
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
});
