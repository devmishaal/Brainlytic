import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS } from '../styles/globalstyle';

const TermsAndConditions = () => {
  const navigation = useNavigation();

  const handleAccept = () => {
    Alert.alert('Thank you!', 'You have accepted the Terms and Conditions.');
    navigation.replace('SignUpScreen'); // Replace with your main screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Terms and Conditions</Text>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.text}>
          Welcome to Study Buddy. Please read these Terms and Conditions
          carefully before using our app:
        </Text>
        <View style={styles.bulletContainer}>
          <Text style={styles.bulletText}>
            {'\u2022'} Acceptance of Terms: By using this app, you agree to
            comply with and be bound by these terms.
          </Text>
          <Text style={styles.bulletText}>
            {'\u2022'} Use of App: Study Buddy is designed for educational and
            personal learning purposes only. Commercial use without permission
            is prohibited.
          </Text>
          <Text style={styles.bulletText}>
            {'\u2022'} AI Responses: The app provides AI-generated content.
            While we strive for accuracy, responses may not always be correct or
            complete. Always double-check important information.
          </Text>
          <Text style={styles.bulletText}>
            {'\u2022'} User Responsibility: You are responsible for how you use
            the information provided. Do not rely solely on the app for exams,
            assignments, or professional advice.
          </Text>
          <Text style={styles.bulletText}>
            {'\u2022'} Data Privacy: We may collect basic user information to
            improve services. Your data will be handled in accordance with our
            Privacy Policy and will not be sold to third parties.
          </Text>
          <Text style={styles.bulletText}>
            {'\u2022'} Content Ownership: All app features, designs, and content
            are owned by the developers. Do not copy, redistribute, or modify
            without permission.
          </Text>
          <Text style={styles.bulletText}>
            {'\u2022'} Prohibited Use: You agree not to misuse the app,
            including attempts to hack, spam, or upload harmful content.
          </Text>
          <Text style={styles.bulletText}>
            {'\u2022'} Termination: We reserve the right to suspend or terminate
            your access for violating these terms or engaging in abusive
            behavior.
          </Text>
          <Text style={styles.bulletText}>
            {'\u2022'} Changes to Terms: We may update these Terms at any time.
            Continued use of the app means you accept the changes.
          </Text>
        </View>
        <Text style={[styles.text, { marginTop: 10 }]}>
          By tapping “Accept”, you acknowledge that you have read and agree to
          these Terms and Conditions.
        </Text>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAccept}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TermsAndConditions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginVertical: 20,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black,
    marginBottom: 10,
  },
  bulletContainer: {
    paddingLeft: 10,
  },
  bulletText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.black,
    marginBottom: 8,
  },
  buttonContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
