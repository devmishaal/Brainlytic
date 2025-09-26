// screens/QuizScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { geminiQuiz } from './gemini-services';
import { COLORS, FONTS, globalStyles } from '../styles/globalstyle';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { API_KEY } from '../utils/apihandler';

const { width, height } = Dimensions.get('window');

export default function QuizScreen() {
  const [quiz, setQuiz] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [interest, setInterest] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const fetchInterestsAndQuiz = async () => {
    try {
      setLoading(true);
      const user = auth().currentUser;
      if (!user) return;

      const snapshot = await firestore();
      const doc = await firestore().collection('users').doc(user.uid).get();
      const data = doc.data();

      if (!data?.interests || data.interests.length === 0) {
        Alert.alert(
          'No Interests Found',
          'Please select your interests first.',
        );
        setLoading(false);
        return;
      }

      const interestsText = data.interests.join(', ');

      if (!snapshot.empty) {
        setInterest(interestsText);

        const q = await geminiQuiz(
          `Generate a quiz of 10 multiple choice questions covering the following topics: ${interestsText}. Mix the questions randomly across all topics.`,
          10,
          API_KEY,
        );

        setQuiz(q);
        setCurrent(0);
        setCorrectCount(0);
        setWrongCount(0);
        setShowResult(false);
      } else {
        Alert.alert(
          'No Interests Found',
          'Please select your interests first.',
        );
      }
    } catch (err) {
      console.error('❌ Quiz load error:', err);
      Alert.alert('Error', 'Failed to load quiz.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterestsAndQuiz();
  }, []);

  const handleSelect = option => {
    if (selected) return;
    setSelected(option);

    const isCorrect = option.trim().startsWith(quiz[current].answer);
    setFeedback(isCorrect ? '✅ Correct!' : '❌ Wrong!');

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    } else {
      setWrongCount(prev => prev + 1);
    }

    setTimeout(() => {
      setSelected(null);
      setFeedback('');
      if (current < quiz.length - 1) {
        setCurrent(current + 1);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Quiz</Text>
        </View>
        <View style={{ marginTop: 20 }} />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loading}>Loading quiz...</Text>
      </View>
    );
  }

  if (quiz.length === 0) {
    return (
      <View style={globalStyles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Quiz</Text>
        </View>
        <Text style={styles.loading}>No quiz available. Try again later.</Text>
      </View>
    );
  }

  // ✅ Show result after quiz ends
  if (showResult) {
    return (
      <View style={globalStyles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Quiz Result</Text>
        </View>
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>🎉 Quiz Completed!</Text>
          <Text style={styles.resultText}>✅ Correct: {correctCount}</Text>
          <Text style={styles.resultText}>❌ Wrong: {wrongCount}</Text>
          <Text style={styles.resultText}>
            🏆 Score: {correctCount} / {quiz.length}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.retryBtn}
          onPress={fetchInterestsAndQuiz}
        >
          <Text style={styles.retryText}>Re-Take Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const q = quiz[current];
  const progress = ((current + 1) / quiz.length) * 100;

  return (
    <View style={globalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quiz</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      {/* Question */}
      <View style={styles.quizCard}>
        <Text style={styles.question}>
          {current + 1}. {q.question}
        </Text>

        {q.options?.map((opt, i) => {
          const isSelected = selected === opt;
          const isCorrect = q.answer && opt.trim().startsWith(q.answer);

          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.optionButton,
                isSelected && isCorrect && { backgroundColor: '#d4fcd4' },
                isSelected && !isCorrect && { backgroundColor: '#fcd4d4' },
              ]}
              onPress={() => handleSelect(opt)}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          );
        })}

        {feedback !== '' && (
          <Text
            style={[
              styles.feedback,
              feedback.includes('Wrong')
                ? { color: 'red' }
                : { color: 'green' },
            ]}
          >
            {feedback}
          </Text>
        )}
      </View>
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

  headerTitle: {
    flex: 1,
    fontFamily: FONTS.bold,
    fontSize: width * 0.05,
    color: COLORS.white,
    textAlign: 'center',
  },

  progressBar: {
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 15,
    overflow: 'hidden',
    marginTop: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  quizCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 14,
    padding: 16,
    margin: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  question: {
    fontSize: width * 0.045,
    fontFamily: FONTS.medium,
    marginBottom: 12,
    color: COLORS.textPrimary,
  },
  optionButton: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
    backgroundColor: COLORS.white,
  },
  optionText: {
    fontSize: width * 0.04,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  feedback: {
    marginTop: 10,
    fontSize: width * 0.042,
    fontFamily: FONTS.medium,
    textAlign: 'center',
  },
  loading: {
    fontSize: width * 0.05,
    fontFamily: FONTS.medium,
    textAlign: 'center',
    marginTop: 20,
  },
  resultCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 20,
    margin: 20,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: width * 0.055,
    fontFamily: FONTS.bold,
    marginBottom: 12,
    color: COLORS.textPrimary,
  },
  resultText: {
    fontSize: width * 0.045,
    fontFamily: FONTS.medium,
    marginVertical: 4,
    color: COLORS.textSecondary,
  },
  retryBtn: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 50,
  },
  retryText: {
    color: COLORS.white,
    fontSize: width * 0.045,
    fontFamily: FONTS.bold,
  },
});
