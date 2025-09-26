import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import { COLORS } from './src/styles/globalstyle';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { SafeAreaView } from 'react-native-safe-area-context';
import {OneSignal, LogLevel} from 'react-native-onesignal';

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const OneSignalInitialization = () => {
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    // Initialize with your OneSignal App ID
    OneSignal.initialize('ff3a95a1-b19d-4dcc-8878-d7ed769a9122');
    // Use this method to prompt for push notifications.
    // We recommend removing this method after testing and instead use In-App Messages to prompt for notification permission.
    OneSignal.Notifications.requestPermission(false);
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '39170936393-e5e3c39fer1ro0gfd37amenfu1877le7.apps.googleusercontent.com',
    });
  }, []);

  useEffect(() => {
    OneSignalInitialization();
    const subscriber = auth().onAuthStateChanged(currentUser => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });
    return subscriber;
  }, []);

  if (initializing) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.background,
        }}
      >
        <ActivityIndicator size="large" color="#1e3e64" />
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1 }}>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
