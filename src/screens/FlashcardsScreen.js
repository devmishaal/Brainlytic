import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Animated,
  SafeAreaView,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { COLORS, FONTS, globalStyles } from '../styles/globalstyle';
import gemini from './gemini-services';
import { API_KEY } from '../utils/apihandler';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const CARD_SPACING = 14;
const ITEM_WIDTH = CARD_WIDTH + CARD_SPACING * 2;
const CARD_HEIGHT = CARD_WIDTH * 1.7;
const SPACING = (width - ITEM_WIDTH) / 2;

export default function FlashcardsScreen() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  const fetchInterestsAndFlashcards = async () => {
    try {
      setLoading(true);
      const user = auth().currentUser;
      if (!user) return;

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

      const promptText = `
You are creating flashcards for a student based on their interests.

Interests: ${interestsText}

⚠️ Rules:
- Each flashcard must be about real knowledge from these interests.
- No questions or answers, only facts, concepts, or short explanations.
- Keep wording simple and easy to understand.
- Do not include instructions or meta text.
- Output only JSON.

Format strictly:
[
  {"title": "short heading", "detail": "short explanation"},
  {"title": "short heading", "detail": "short explanation"}
]
`;

      const result = await gemini.geminiFlashcards(promptText, API_KEY);

      if (Array.isArray(result)) {
        setCards(result);
      } else {
        setCards([{ title: 'Info', detail: result }]);
      }
    } catch (err) {
      console.error('❌ Flashcards load error:', err);
      setCards([{ title: 'Error', detail: err.message }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterestsAndFlashcards();
  }, []);

  const onMomentumScrollEnd = useCallback(
    event => {
      const contentOffset = event.nativeEvent.contentOffset.x;
      const index = Math.round(contentOffset / ITEM_WIDTH);
      if (index !== activeIndex) setActiveIndex(index);
    },
    [activeIndex],
  );

  const renderCard = ({ item, index }) => {
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ];

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [30, 0, 30],
      extrapolate: 'clamp',
    });

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });

    const rotate = scrollX.interpolate({
      inputRange,
      outputRange: ['8deg', '0deg', '-8deg'],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.cardWrapper}>
        <Animated.View
          style={[
            styles.card,
            { transform: [{ translateY }, { scale }, { rotate }] },
          ]}
        >
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.detail}>{item.detail}</Text>
        </Animated.View>
      </View>
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Flashcards</Text>
      </View>

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Creating flashcards...</Text>
        </View>
      )}

      {!loading && cards.length > 0 && (
        <>
          <Animated.FlatList
            ref={flatListRef}
            data={cards}
            renderItem={renderCard}
            keyExtractor={(_, i) => i.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={ITEM_WIDTH}
            contentContainerStyle={{ paddingHorizontal: SPACING }}
            decelerationRate="fast"
            disableIntervalMomentum
            snapToAlignment="start"
            bounces={false}
            overScrollMode="never"
            scrollEnabled={cards.length > 1}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true },
            )}
            scrollEventThrottle={16}
            onMomentumScrollEnd={onMomentumScrollEnd}
            getItemLayout={(data, index) => ({
              length: ITEM_WIDTH,
              offset: ITEM_WIDTH * index,
              index,
            })}
          />
          <View style={styles.pagination}>
            {cards.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === activeIndex ? styles.activeDot : {}]}
              />
            ))}
          </View>
        </>
      )}

      {!loading && cards.length === 0 && (
        <Text style={styles.placeholder}>No flashcards yet</Text>
      )}
    </SafeAreaView>
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
  loader: {
    marginTop: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontFamily: FONTS.medium,
    fontSize: width * 0.04,
    color: COLORS.textPrimary,
  },
  cardWrapper: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: width * 0.05,
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  detail: {
    fontFamily: FONTS.regular,
    fontSize: width * 0.042,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 18,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  placeholder: {
    fontFamily: FONTS.medium,
    fontSize: width * 0.04,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 30,
  },
});
