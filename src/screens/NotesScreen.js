// screens/NotesScreen.js
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import gemini from '../screens/gemini-services';
import { COLORS, FONTS, globalStyles } from '../styles/globalstyle';
import { ArrowLeft } from 'lucide-react-native';
import CustomButton from '../components/CustomButton';
import Markdown from 'react-native-markdown-display';
import CustomInput from '../components/CustomInput';
import { API_KEY } from '../utils/apihandler';

const { width, height } = Dimensions.get('window');

export default function NotesScreen({ navigation }) {
  const [note, setNote] = useState('');
  const [improved, setImproved] = useState('');
  const [loading, setLoading] = useState(false);

  const improveNote = async () => {
    try {
      setLoading(true);
      setImproved('');
      const prompt = `Improve and organize this study note into clear bullet points and a short summary:\n\n${note}`;

      const res = await gemini.geminiChat(prompt, API_KEY);
      setImproved(res); 
    } catch (err) {
      setImproved('The AI service is busy right now. Please try again in a moment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ArrowLeft color={COLORS.white} size={26} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Smart Notes</Text>
      </View>

      <View style={{ paddingVertical: 20, paddingHorizontal: 16 }}>
        {/* Input */}
        <CustomInput
          placeholder="Write or paste your notes here..."
          value={note}
          onChangeText={setNote}
          multiline={true}
        />

        {/* Button */}
        <CustomButton
          title={loading ? 'Improving...' : 'Improve Note'}
          onPress={improveNote}
          style={[{ marginBottom: 15 }, loading && { opacity: 0.6 }]}
        />

        {/* Output */}
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {improved ? (
            <View style={styles.outputCard}>
              <Markdown
                style={{
                  body: {
                    fontSize: width * 0.04,
                    fontFamily: FONTS.regular,
                    color: COLORS.textPrimary,
                    lineHeight: 22,
                  },
                  heading1: {
                    fontSize: width * 0.05,
                    fontFamily: FONTS.bold,
                    color: COLORS.primary,
                    marginBottom: 8,
                  },
                  heading2: {
                    fontSize: width * 0.048,
                    fontFamily: FONTS.semiBold,
                    color: COLORS.primary,
                    marginBottom: 6,
                  },
                  heading3: {
                    fontSize: width * 0.045,
                    fontFamily: FONTS.semiBold,
                    color: COLORS.primary,
                    marginBottom: 6,
                  },
                  list_item: {
                    fontSize: width * 0.04,
                    lineHeight: 22,
                  },
                  strong: { fontFamily: FONTS.semiBold },
                  em: { fontFamily: FONTS.italic },
                }}
              >
                {improved}
              </Markdown>
            </View>
          ) : (
            <Text style={styles.placeholder}>No improved notes yet</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: height * 0.02,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontFamily: FONTS.bold,
    fontSize: width * 0.05,
    color: COLORS.white,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: height * 0.36,
  },

  outputCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 12,
  },

  placeholder: {
    textAlign: 'center',
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    fontSize: width * 0.038,
    marginTop: 20,
  },
});
