import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { globalStyles, COLORS, FONTS } from '../styles/globalstyle';
import {
  MessageCircle,
  FileText,
  StickyNote,
  Trash2,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = auth().currentUser;

  useEffect(() => {
    if (user) {
      fetchUserName(user.uid);
      loadChats(user.uid);
    }
  }, [user]);

  const fetchUserName = async uid => {
    try {
      const docSnap = await firestore().collection('users').doc(uid).get();
      if (docSnap.exists) {
        setUserName(docSnap.data().username);
      } else {
        setUserName('Guest');
      }
    } catch (error) {
      setUserName('Guest');
    } finally {
      setLoading(false);
    }
  };

  const loadChats = async uid => {
    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(uid)
        .collection('chats')
        .orderBy('createdAt', 'desc')
        .get();

      const chatList = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title || 'Untitled Chat',
      }));

      setChats(chatList);
    } catch (error) {
      console.log('❌ Error loading chats:', error);
    }
  };

  const deleteChat = async (uid, chatId) => {
    try {
      await firestore()
        .collection('users')
        .doc(uid)
        .collection('chats')
        .doc(chatId)
        .delete();

      setChats(prev => prev.filter(chat => chat.id !== chatId));
    } catch (error) {
      console.error('❌ Error deleting chat:', error);
      Alert.alert('Error', 'Failed to delete chat. Please try again.');
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

  return (
    <View
      style={[globalStyles.container, { backgroundColor: COLORS.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Brainlytic - AI Study Buddy</Text>
        <Text style={styles.subHeader}>
          How can I help you today, {userName}? 👋
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Features</Text>
      {/* Action Buttons */}
      <View style={styles.actionsWrapper}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() =>
            navigation.navigate('AIChatScreen', { chatId: null, userName })
          }
        >
          <MessageCircle color={COLORS.primary} size={22} />
          <Text style={styles.actionText}>Start a Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('DocumentSumarizer')}
        >
          <FileText color={COLORS.primary} size={22} />
          <Text style={styles.actionText}>Upload Document</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('NotesScreen')}
        >
          <StickyNote color={COLORS.primary} size={22} />
          <Text style={styles.actionText}>Smart Notes</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Chats */}
      <Text style={styles.sectionTitle}>Recent Chats</Text>
      {chats.length === 0 ? (
        <Text style={styles.emptyText}>No chats yet</Text>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.chatItem}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() =>
                  navigation.navigate('AIChatScreen', {
                    chatId: item.id,
                    userName,
                  })
                }
              >
                <Text style={styles.chatText}>📝 {item.title}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    'Delete Chat',
                    'Are you sure you want to delete this chat?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => deleteChat(user.uid, item.id),
                      },
                    ]
                  )
                }
              >
                <Trash2 color="red" size={20} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: width * 0.05,
    fontFamily: FONTS.semiBold,
    color: COLORS.white,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: width * 0.038,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    textAlign: 'center',
    marginTop: 4,
  },
  actionsWrapper: {
    marginHorizontal: 10,
  },
  actionCard: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  actionText: {
    marginLeft: 8,
    fontSize: width * 0.04,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontFamily: FONTS.semiBold,
    marginHorizontal: 16,
    marginVertical: 10,
    color: COLORS.textPrimary,
  },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: width * 0.04,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  chatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 13,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chatText: {
    fontSize: width * 0.04,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
  },
});
