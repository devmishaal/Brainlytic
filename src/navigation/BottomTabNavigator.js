import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Home,
  CircleUserRound,
  HelpCircle,
  BookOpen,
} from 'lucide-react-native';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FlashcardsScreen from '../screens/FlashcardsScreen';
import QuizScreen from '../screens/QuizScreen';
import { COLORS, FONTS } from '../styles/globalstyle';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const CustomTabIcon = ({ label, Icon, focused, color }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: focused ? COLORS.white : 'transparent',
        borderRadius: 35,
        width: 85,
        height: 45,
        top: 15,
      }}
    >
      <Icon size={25} color={focused ? COLORS.primary : COLORS.white} />
      {focused ? (
        <Text
          style={{
            fontFamily: FONTS.medium,
            fontSize: 14,
            left: 3,
            color: COLORS.primary,
          }}
        >
          {label}
        </Text>
      ) : null}
    </View>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: COLORS.primary,
          borderRadius: 20,
          height: 70,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <CustomTabIcon
              label="Home"
              Icon={Home}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Flashcards"
        component={FlashcardsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <CustomTabIcon
              label="Cards"
              Icon={BookOpen}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Quiz"
        component={QuizScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <CustomTabIcon
              label="Quiz"
              Icon={HelpCircle}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <CustomTabIcon
              label="Profile"
              Icon={CircleUserRound}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
