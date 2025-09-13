import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { globalStyles } from '../styles/globalstyle';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <Text>HomeScreen</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
