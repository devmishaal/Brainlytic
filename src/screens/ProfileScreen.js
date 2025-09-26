import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { COLORS, FONTS, globalStyles } from '../styles/globalstyle';
import CustomButton from '../components/CustomButton';

const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth().currentUser;
        console.log('current user id:', currentUser.uid);
        if (!currentUser) return;
        const doc = await firestore()
          .collection('users')
          .doc(currentUser.uid)
          .get();
        if (doc.exists) setUserData(doc.data());
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to log out. Try again.');
    }
  };

  if (loading) {
    return (
      <View
        style={[
          globalStyles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const joinDate = userData?.createdAt
    ? new Date(
        userData.createdAt.seconds
          ? userData.createdAt.seconds * 1000
          : userData.createdAt,
      ).toDateString()
    : 'N/A';

  return (
    <View style={globalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Profile Info */}
      <View style={styles.infoContainer}>
        {userData ? (
          <>
            <View style={styles.card}>
              <Text style={styles.label}>Username</Text>
              <Text style={styles.value}>{userData.username || 'N/A'}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{userData.email || 'N/A'}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.label}>Joined</Text>
              <Text style={styles.value}>{joinDate}</Text>
            </View>

            {/* Interests Section */}
            <View style={styles.card}>
              <Text style={styles.label}>Interests</Text>
              {userData?.interests?.length ? (
                <Text style={styles.value}>
                  {userData.interests.join(', ')}
                </Text>
              ) : (
                <Text style={styles.value}>No interests selected</Text>
              )}
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('InterestScreen', {
                    selected: userData?.interests || [],
                  })
                }
                style={styles.editBtn}
              >
                <Text style={styles.editText}>Edit Interests</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.noData}>No user data found.</Text>
        )}

        <CustomButton
          title="Log Out"
          onPress={handleLogout}
          style={{ marginTop: 10 }}
        />
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: height * 0.02,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    flex: 1,
    fontFamily: FONTS.bold,
    fontSize: width * 0.05,
    color: COLORS.white,
    textAlign: 'center',
  },

  infoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: width * 0.04,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontFamily: FONTS.regular,
    fontSize: width * 0.045,
    color: COLORS.textPrimary,
  },
  noData: {
    fontFamily: FONTS.regular,
    fontSize: width * 0.04,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  editBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  editText: {
    color: COLORS.white,
    fontSize: width * 0.035,
    fontFamily: FONTS.medium,
  },
});
