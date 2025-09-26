import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import AIChatScreen from '../screens/AIChatScreen';
import InterestScreen from '../screens/InterestScreen';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { View, ActivityIndicator } from 'react-native';
import DocumentUploadScreen from '../screens/DocumentUploadScreen';
import NotesScreen from '../screens/NotesScreen';
import { COLORS } from '../styles/globalstyle';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const user = auth().currentUser;
      if (!user) return setInitialRoute('InterestScreen');

      try {
        const userDoc = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();

        const userData = userDoc.data();

        if (
          userData?.interests &&
          Array.isArray(userData.interests) &&
          userData.interests.length > 0
        ) {
          console.log('✅ Interests found → MainTabs');
          setInitialRoute('MainTabs');
        } else {
          console.log('⚠️ No interests → InterestScreen');
          setInitialRoute('InterestScreen');
        }
      } catch (err) {
        console.error('❌ Error checking interests:', err);
        setInitialRoute('InterestScreen');
      }
    };

    checkUser();
  }, []);

  if (!initialRoute) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.background,
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="InterestScreen" component={InterestScreen} />
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="AIChatScreen" component={AIChatScreen} />
      <Stack.Screen name="DocumentSumarizer" component={DocumentUploadScreen} />
      <Stack.Screen name="NotesScreen" component={NotesScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
