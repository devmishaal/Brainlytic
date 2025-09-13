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
          Welcome to our Yoga App. Please read these Terms and Conditions
          carefully before using our app:
        </Text>
        <View style={styles.bulletContainer}>
          <Text style={styles.bulletText}>
            {'\u2022'} Acceptance of Terms: By using this app, you agree to
            comply with and be bound by these terms.
          </Text>
          <Text style={styles.bulletText}>
            {'\u2022'} Use of App: You must be at least 18 years old to use this
            app. The app is intended for personal, non-commercial use.
          </Text>
          <Text style={styles.bulletText}>
            {'\u2022'} Health Disclaimer: Yoga involves physical activity.
            Consult your physician before starting any new fitness program. The
            app is not responsible for any injuries or health issues arising
            from your use.
          </Text>
          <Text style={styles.bulletText}>
            {'\u2022'} Content Ownership: All content, videos, and images in
            this app are owned by us or our licensors. Do not copy, reproduce,
            or distribute without permission.
          </Text>
          <Text style={styles.bulletText}>
            {'\u2022'} User Conduct: You agree not to misuse the app, post
            harmful content, or engage in any illegal activities.
          </Text>
          <Text style={styles.bulletText}>
            {'\u2022'} Privacy: Your data is handled according to our Privacy
            Policy. By using the app, you consent to the collection and use of
            data as described.
          </Text>
          <Text style={styles.bulletText}>
            {'\u2022'} Termination: We reserve the right to suspend or terminate
            your access for violation of terms.
          </Text>
          <Text style={styles.bulletText}>
            {'\u2022'} Changes to Terms: We may update these Terms at any time.
            Continued use of the app indicates acceptance of changes.
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
