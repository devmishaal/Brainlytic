// screens/ChatScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native';
import gemini from './gemini-services';
import { COLORS, FONTS, globalStyles } from '../styles/globalstyle';
import CustomInput from '../components/CustomInput';
import { ArrowLeft, Send } from 'lucide-react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Markdown from 'react-native-markdown-display';
import { API_KEY } from '../utils/apihandler';

const { width, height } = Dimensions.get('window');

export default function AIChatScreen({ navigation, route }) {
  const { chatId } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [activeChatId, setActiveChatId] = useState(chatId || null);
  const user = auth().currentUser;

  useEffect(() => {
    if (!user || !activeChatId) return;

    const unsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('chats')
      .doc(activeChatId)
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .onSnapshot(snapshot => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(msgs);
      });

    return () => unsubscribe();
  }, [user, activeChatId]);

  const send = async () => {
    if (!input.trim()) return;

    const userMsg = { from: 'user', text: input, createdAt: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const reply = await gemini.geminiChat(
        input,
        API_KEY,
        'You are a helpful study assistant.',
      );

      const aiMsg = { from: 'ai', text: reply, createdAt: Date.now() };
      setMessages(prev => [...prev, aiMsg]);

      if (user) {
        let chatRef;

        if (activeChatId) {
          chatRef = firestore()
            .collection('users')
            .doc(user.uid)
            .collection('chats')
            .doc(activeChatId);
        } else {
          chatRef = firestore()
            .collection('users')
            .doc(user.uid)
            .collection('chats')
            .doc();

          await chatRef.set({
            title: input.slice(0, 20) + '...',
            createdAt: firestore.FieldValue.serverTimestamp(),
          });

          setActiveChatId(chatRef.id); 
        }

        await chatRef.collection('messages').add(userMsg);
        await chatRef.collection('messages').add(aiMsg);
      }
    } catch (e) {
      const errorMsg = {
        from: 'ai',
        text: 'Error: ' + e.message,
        createdAt: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const renderItem = ({ item }) => {
    const isUser = item.from === 'user';

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        ]}
      >
        {isUser ? (
          <Text style={[styles.messageText, styles.userMessageText]}>
            {item.text}
          </Text>
        ) : (
          <Markdown
            style={{
              body: {
                fontSize: width * 0.038,
                fontFamily: FONTS.regular,
                color: COLORS.textPrimary,
                lineHeight: 20,
              },
              heading1: {
                fontSize: width * 0.045,
                fontFamily: FONTS.bold,
                color: COLORS.primary,
              },
              heading2: {
                fontSize: width * 0.043,
                fontFamily: FONTS.semiBold,
                color: COLORS.primary,
              },
              heading3: {
                fontSize: width * 0.042,
                fontFamily: FONTS.semiBold,
                color: COLORS.primary,
              },
              list_item: { fontSize: width * 0.038, lineHeight: 20 },
              strong: { fontFamily: FONTS.semiBold },
              em: { fontFamily: FONTS.italic },
            }}
          >
            {item.text}
          </Markdown>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ArrowLeft size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Chat</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Chat body */}
      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Start your conversation ✨</Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={item => item.id || String(item.createdAt)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
      )}

      {/* Input row */}
      <View style={styles.inputRow}>
        <View style={{ flex: 1 }}>
          <CustomInput
            placeholder="Ask me anything..."
            value={input}
            onChangeText={setInput}
          />
        </View>
        <TouchableOpacity onPress={send} style={styles.sendButton}>
          <Send color={COLORS.primary} size={22} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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

  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 14,
    marginHorizontal: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userMessageContainer: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
    borderTopLeftRadius: 4,
  },
  aiMessageContainer: {
    backgroundColor: COLORS.white,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderTopRightRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  messageText: {
    fontSize: width * 0.038,
    fontFamily: FONTS.regular,
    lineHeight: 20,
  },
  userMessageText: {
    color: COLORS.white,
  },
  aiMessageText: {
    color: COLORS.textPrimary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 15,
  },
  sendButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginLeft: 8,
    marginTop: 10,
  },
  sendButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FONTS.medium,
    fontSize: width * 0.045,
    color: COLORS.textSecondary,
  },
});
