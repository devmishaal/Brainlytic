import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, globalStyles } from '../styles/globalstyle';

const { width, height } = Dimensions.get('window');

const PasswordResetVerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params || {};

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.05,
        backgroundColor: COLORS.background,
      }}
    >
      <View style={{ flex: 1, paddingTop: height * 0.01 }}>
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
          Check Your Email
        </Text>

        <Text
          style={[
            globalStyles.bodyText,
            { textAlign: 'center', marginVertical: height * 0.01 },
          ]}
        >
          We sent a password reset link to:
        </Text>

        <Text
          style={[
            globalStyles.bodyText,
            {
              textAlign: 'center',
              fontWeight: 'bold',
              color: COLORS.primary,
              fontSize: width * 0.045,
            },
          ]}
        >
          {email}
        </Text>

        <Text
          style={[
            globalStyles.bodyText,
            {
              textAlign: 'center',
              marginTop: height * 0.02,
              color: COLORS.gray,
            },
          ]}
        >
          Open your inbox and follow the link to reset your password.
        </Text>

        <TouchableOpacity
          style={[styles.button, { marginTop: height * 0.05 }]}
          onPress={() => navigation.navigate('SignInScreen')}
        >
          <Text style={styles.buttonText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default PasswordResetVerificationScreen;

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
