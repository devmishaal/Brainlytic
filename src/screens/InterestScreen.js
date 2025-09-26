import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { globalStyles, COLORS, FONTS } from '../styles/globalstyle';
import CustomButton from '../components/CustomButton';

const { width, height } = Dimensions.get('window');

const interestsList = [
  'Artificial Intelligence',
  'Mathematics',
  'Science',
  'History',
  'Programming',
  'Business',
  'Psychology',
  'Languages',
  'Art & Design',
  'Political Science',
  'Philosophy',
  'Sociology',
  'Economics',
  'Law & Legal Studies',
  'Medicine & Health',
  'Biology',
  'Physics',
  'Chemistry',
  'Astronomy',
  'Engineering',
  'Environmental Studies',
  'Geography',
  'Literature',
  'Music',
  'Film & Media Studies',
  'Education & Teaching',
  'Communication',
  'Journalism',
  'Data Science',
  'Data Analysis',
  'Cybersecurity',
  'Robotics',
  'Ethics & Morality',
  'Religious Studies',
  'Anthropology',
];

const InterestScreen = ({ navigation, route }) => {
  const [selected, setSelected] = useState(route?.params?.selected || []);

  const toggleInterest = item => {
    if (selected.includes(item)) {
      setSelected(selected.filter(i => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const saveInterests = async () => {
    const user = auth().currentUser;
    if (!user) return;

    if (selected.length === 0) {
      Alert.alert('Select at least one interest');
      return;
    }

    try {
      await firestore().collection('users').doc(user.uid).set(
        {
          interests: selected,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      navigation.replace('MainTabs');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View
      style={[globalStyles.container, { backgroundColor: COLORS.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choose Your Interests</Text>
      </View>

      {/* Subtitle */}
      <Text style={styles.subTitle}>
        Select the topics you love to learn about
      </Text>

      {/* Interests List */}
      <FlatList
        data={interestsList}
        keyExtractor={item => item}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => {
          const isSelected = selected.includes(item);
          return (
            <TouchableOpacity
              style={[
                styles.card,
                {
                  backgroundColor: isSelected
                    ? COLORS.primary
                    : COLORS.cardBackground,
                  borderColor: isSelected ? COLORS.primary : COLORS.border,
                },
              ]}
              onPress={() => toggleInterest(item)}
            >
              <Text
                style={[
                  styles.cardText,
                  { color: isSelected ? COLORS.white : COLORS.textPrimary },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Continue Button */}
      <View style={styles.footer}>
        <CustomButton title={'Continue'} onPress={saveInterests} />
      </View>
    </View>
  );
};

export default InterestScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: height * 0.03,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: width * 0.06,
    color: COLORS.white,
  },
  subTitle: {
    fontFamily: FONTS.regular,
    fontSize: width * 0.045,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginVertical: height * 0.02,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingHorizontal: width * 0.04,
    paddingBottom: height * 0.12,
  },
  card: {
    flex: 1,
    margin: width * 0.015,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 3,
    paddingVertical: height * 0.025,
    paddingHorizontal: width * 0.04,
  },
  cardText: {
    fontSize: width * 0.04,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    paddingVertical: 15,
    width: '100%',
    paddingHorizontal: width * 0.07,
    backgroundColor: COLORS.background,
  },
});
