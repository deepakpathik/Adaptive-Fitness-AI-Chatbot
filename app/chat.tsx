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
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedView = Animated.createAnimatedComponent(View);

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', content: 'Hello! I am your adaptive fitness coach. How can I help you today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const distinctId = await getOrCreateDistinctId();
      const lifestyle = await getLifestyleData();

      const response = await ChatService.sendMessage(distinctId, userMsg.content, lifestyle);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response.reply,
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

  const renderMessage = ({ item, index }: { item: Message, index: number }) => {
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
          <AnimatedLinearGradient
            colors={['#34C759', '#30B34D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.messageBubble, styles.userBubble]}
          >
            <Text style={styles.messageText}>{item.content}</Text>
          </AnimatedLinearGradient>
        ) : (
          <AnimatedView style={[styles.messageBubble, styles.aiBubble]}>
            <Text style={styles.messageText}>{item.content}</Text>
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
  };

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
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <BlurView intensity={20} tint="dark" style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              activeOpacity={0.7}
            >
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
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={item => item.id}
              renderItem={renderMessage}
              contentContainerStyle={styles.chatListContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            />

            {loading && (
              <Animated.View
                entering={FadeInUp}
                style={styles.loadingContainer}
              >
                <View style={styles.loadingBubble}>
                  <ActivityIndicator size="small" color="#FF69B4" />
                  <Text style={styles.loadingText}>Coach is thinking...</Text>
                </View>
              </Animated.View>
            )}

            <BlurView intensity={60} tint="dark" style={styles.inputWrapper}>
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
                  onPress={sendMessage}
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
          </KeyboardAvoidingView>
        </SafeAreaView>
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
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#FF69B4', // Pink
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
});
