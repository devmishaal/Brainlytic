import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import AppIntroSlider from '../screens/AppIntroSlider';
import LetsGetStartedScreen from '../screens/LetsGetStartedScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import PasswordResetVerificationScreen from '../screens/PasswordResetVerificationScreen';
import TermandConditions from '../screens/TermandConditions';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="AppIntroSlider" component={AppIntroSlider} />
      <Stack.Screen
        name="LetsGetStartedScreen"
        component={LetsGetStartedScreen}
      />
      <Stack.Screen name="SignInScreen" component={SignInScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
      <Stack.Screen
        name="PasswordResetVerificationScreen"
        component={PasswordResetVerificationScreen}
      />
      <Stack.Screen name='TermandConditions' component={TermandConditions} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
