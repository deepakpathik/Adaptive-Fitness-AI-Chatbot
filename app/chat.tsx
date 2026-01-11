import { ChatService } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  quickActions?: string[];
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedView = Animated.createAnimatedComponent(View);

const MessageItem = React.memo(({ item, index }: { item: Message, index: number }) => {
  const isUser = item.role === 'user';
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      layout={Layout.springify()}
      style={[
        styles.messageRow,
        isUser ? styles.userRow : styles.aiRow
      ]}
    >
      {!isUser && (
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={['#FF69B4', '#FF1493']}
            style={styles.avatar}
          >
            <Ionicons name="fitness" size={16} color="#FFF" />
          </LinearGradient>
        </View>
      )}

      {isUser ? (
        <AnimatedView
          style={[styles.messageBubble, styles.userBubble]}
        >
          <Text style={styles.messageText}>{item.content}</Text>
        </AnimatedView>
      ) : (
        <AnimatedView style={[styles.messageBubble, styles.aiBubble]}>
          <Markdown
            style={{
              body: { color: '#FFF', fontSize: 16, lineHeight: 22 },
              bullet_list: { marginBottom: 8 },
              ordered_list: { marginBottom: 8 },
              bullet_list_icon: { color: '#FFF', marginRight: 8 },
              table: { borderColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderRadius: 4 },
              tr: { borderColor: 'rgba(255,255,255,0.2)', borderBottomWidth: 1 },
              th: { borderBottomColor: 'rgba(255,255,255,0.2)', borderBottomWidth: 1, padding: 4, fontWeight: '700' },
              td: { borderTopWidth: 0, padding: 4, fontSize: 14 },
            }}
          >
            {item.content}
          </Markdown>

          {item.quickActions && item.quickActions.length > 0 && (
            <View style={styles.quickActionsContainer}>
              {item.quickActions.map((action, actionIndex) => (
                <View key={actionIndex} style={styles.quickActionPill}>
                  <Text style={styles.quickActionText}>{action}</Text>
                </View>
              ))}
            </View>
          )}
        </AnimatedView>
      )}

      {isUser && (
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={['#007AFF', '#0056D2']}
            style={styles.avatar}
          >
            <Ionicons name="person" size={16} color="#FFF" />
          </LinearGradient>
        </View>
      )}
    </Animated.View>
  );
}, (prevProps, nextProps) => {
  return prevProps.item.id === nextProps.item.id &&
    prevProps.item.content === nextProps.item.content &&
    prevProps.item.role === nextProps.item.role;
});

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', content: 'Hello! I am your adaptive fitness coach. How can I help you today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async (text?: string) => {
    const contentToSend = (typeof text === 'string' ? text : null) || inputText;
    if (!contentToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: contentToSend.trim(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const distinctId = await getOrCreateDistinctId();
      const lifestyle = await getLifestyleData();
      const personality = await AsyncStorage.getItem('userPersonality') || 'Encouragement Seeker';

      const response = await ChatService.sendMessage(distinctId, userMsg.content, lifestyle, personality);

      const quickActionRegex = /\[\[QUICK_ACTION:(.*?)\]\]/g;
      const quickActions: string[] = [];
      let cleanContent = response.reply;
      let match;

      while ((match = quickActionRegex.exec(response.reply)) !== null) {
        quickActions.push(match[1]);
      }
      cleanContent = cleanContent.replace(quickActionRegex, '').trim();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: cleanContent,
        quickActions: quickActions.length > 0 ? quickActions : undefined,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Send Error:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "Sorry, I'm having trouble connecting to the server. Please try again.",
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const getOrCreateDistinctId = async () => {
    try {
      let distinctId = await AsyncStorage.getItem('distinctId');
      if (!distinctId) {
        distinctId = Math.random().toString(36).substring(7);
        await AsyncStorage.setItem('distinctId', distinctId);
      }
      return distinctId;
    } catch (e) {
      return 'user-' + Date.now();
    }
  };

  const getLifestyleData = async () => {
    try {
      const lifestyleString = await AsyncStorage.getItem('lifestyleData');
      return lifestyleString ? JSON.parse(lifestyleString) : {};
    } catch (e) {
      return {};
    }
  };

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const renderItem = ({ item, index }: { item: Message, index: number }) => (
    <MessageItem item={item} index={index} />
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/app_bg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.9)']}
          style={styles.overlay}
        />
        <View style={{ flex: 1 }}>
          <BlurView
            intensity={20}
            tint="dark"
            style={[styles.header, { paddingTop: insets.top + 12 }]}
          >
            {/* Header Content */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <BlurView intensity={40} tint="light" style={styles.backButtonBlur}>
                <Ionicons name="chevron-back" size={24} color="#FFF" />
              </BlurView>
            </TouchableOpacity>

            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Fitness Coach</Text>
              <View style={styles.onlineBadge} />
            </View>
            <TouchableOpacity style={styles.menuButton}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#FFF" />
            </TouchableOpacity>
          </BlurView>

          <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          >
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              contentContainerStyle={[styles.chatListContent, { paddingBottom: insets.bottom + 20 }]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              initialNumToRender={15}
              maxToRenderPerBatch={10}
              windowSize={11}
              removeClippedSubviews={true}
              updateCellsBatchingPeriod={50}
            />

            {/* Input Wrapper */}
            {messages.length > 0 && ( // Just ensuring structure
              <>
                {loading && (
                  <Animated.View entering={FadeInUp} style={styles.loadingContainer}>
                    <View style={styles.loadingBubble}>
                      <ActivityIndicator size="small" color="#FF69B4" />
                      <Text style={styles.loadingText}>Coach is thinking...</Text>
                    </View>
                  </Animated.View>
                )}

                <BlurView intensity={60} tint="dark" style={[styles.inputWrapper, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                  {/* Input Content */}
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Ask about workouts..."
                      placeholderTextColor="#999"
                      value={inputText}
                      onChangeText={setInputText}
                      multiline
                      returnKeyType="default"
                    />
                    <TouchableOpacity
                      style={[styles.sendButton, (!inputText.trim() || loading) && styles.disabledSend]}
                      onPress={() => sendMessage()}
                      disabled={!inputText.trim() || loading}
                    >
                      <LinearGradient
                        colors={['#007AFF', '#0056D2']}
                        style={styles.sendButtonGradient}
                      >
                        <Ionicons name="arrow-up" size={22} color="#FFF" />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </BlurView>
              </>
            )}
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  backButtonBlur: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  onlineBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
    shadowColor: '#34C759',
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardContainer: {
    flex: 1,
  },
  chatListContent: {
    padding: 16,
    paddingBottom: 20,
    gap: 16,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    maxWidth: '100%',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  aiRow: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginBottom: 2,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  userBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#FFF',
  },
  loadingContainer: {
    paddingLeft: 52, // Align with AI bubbles (avatar width + gap)
    marginBottom: 16,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    gap: 8,
  },
  loadingText: {
    color: '#AAA',
    fontSize: 13,
  },
  inputWrapper: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 16 : 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 28,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledSend: {
    opacity: 0.6,
  },
  quickActionsContainer: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickActionPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  quickActionText: {
    color: '#E0E0E0',
    fontSize: 12,
    fontWeight: '500',
  },
});
