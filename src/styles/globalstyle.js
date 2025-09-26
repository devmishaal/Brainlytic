import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  background: '#d5ebf9',
  primary: '#1e3e64',
  secondary: '#a6d2ed',
  tertiary: '#fcb740',
  warning: '#FF9B73',
  textPrimary: '#2F2F2F',
  textSecondary: '#6C757D',
  cardBackground: '#FFFFFF',
  border: '#E4E6E5',
  white: '#ffffff',
  black: '#000000',
};

export const FONTS = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
  extraBold: 'Poppins-ExtraBold',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    // paddingHorizontal: 16,
    // paddingVertical: 18,
  },
  titleText: {
    fontFamily: FONTS.bold,
    fontSize: width * 0.055,
    color: COLORS.textPrimary,
    marginBottom: height * 0.01,
  },
  bodyText: {
    fontFamily: FONTS.regular,
    fontSize: width * 0.035,
    color: COLORS.textSecondary,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: height * 0.018,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: FONTS.medium,
    fontSize: width * 0.04,
    color: COLORS.white,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: width * 0.04,
    marginBottom: height * 0.015,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: height * 0.015,
    fontFamily: FONTS.regular,
    fontSize: width * 0.04,
    color: COLORS.textPrimary,
  },
  sliderButton: {
    paddingVertical: height * 0.015,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButton: {
    backgroundColor: COLORS.secondary,
    width: '48%',
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    width: '48%',
  },
  getStartedButton: {
    backgroundColor: COLORS.primary,
    width: '90%',
  },
});
