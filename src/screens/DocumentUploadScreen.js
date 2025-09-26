import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { pick } from '@react-native-documents/picker';
import gemini from '../screens/gemini-services';
import { COLORS, FONTS, globalStyles } from '../styles/globalstyle';
import CustomButton from '../components/CustomButton';
import { ArrowLeft } from 'lucide-react-native';
import Markdown from 'react-native-markdown-display';
import { API_KEY } from '../utils/apihandler';

const { width, height } = Dimensions.get('window');

export default function DocumentUploadScreen({ navigation }) {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickAndSummarize = async () => {
    try {
      setError(null);
      setSummary(null);
      setLoading(true);

      const results = await pick({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
          'application/doc',
        ],
        allowMultiSelection: false,
        copyTo: 'documentDirectory',
      });

      const file = results[0];
      if (!file?.uri) throw new Error('No file selected');
      console.log('📂 Picked file:', file);

      const s = await gemini.geminiSummarizeDoc(file, API_KEY);
      console.log('📥 Gemini summary:', s);
      setSummary(s);
    } catch (e) {
      console.error('❌ Document upload / summary error:', e);
      setError(e.message);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const renderSummary = data => {
    // Use Markdown to render AI summary
    if (!data) return null;
    return (
      <Markdown
        style={{
          body: {
            fontSize: width * 0.04,
            fontFamily: FONTS.regular,
            color: COLORS.textPrimary,
            lineHeight: 22,
          },
        }}
      >
        {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
      </Markdown>
    );
  };

  return (
    <View style={globalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ArrowLeft size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Document Summarizer</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Pick & Summarize Button */}
      <CustomButton
        title={loading ? 'Summarizing...' : 'Pick Document & Summarize'}
        onPress={pickAndSummarize}
        style={{ margin: 10 }}
        disabled={loading}
      />

      {/* Scrollable Summary */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading && (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 20 }}
          />
        )}
        {error && <Text style={styles.errorText}>{`Error: ${error}`}</Text>}
        {summary ? (
          <View style={styles.chatBubble}>{renderSummary(summary)}</View>
        ) : (
          !loading && <Text style={styles.placeholder}>No summary yet</Text>
        )}
      </ScrollView>
    </View>
  );
}

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

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: height * 0.03,
  },
  errorText: {
    color: COLORS.error,
    fontFamily: FONTS.medium,
    marginTop: 8,
    fontSize: width * 0.038,
    textAlign: 'center',
  },
  placeholder: {
    marginTop: 12,
    fontSize: width * 0.038,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  chatBubble: {
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginTop: 12,
  },
});
