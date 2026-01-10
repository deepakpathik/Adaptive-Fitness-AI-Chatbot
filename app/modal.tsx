
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const PERSONALITIES = [
  {
    id: 'Encouragement Seeker',
    title: 'Encouragement Seeker',
    icon: 'heart.fill',
    description: 'Easily demotivated? I will provide constant reassurance, praise small wins, and gently nudge you forward.',
  },
  {
    id: 'Creative Explorer',
    title: 'Creative Explorer',
    icon: 'paintpalette.fill',
    description: 'Dislike routine? I will suggest fun, unconventional, and diverse activities to keep things fresh.',
  },
  {
    id: 'Goal Finisher',
    title: 'Goal Finisher',
    icon: 'flag.fill',
    description: 'Love checklists? I will be concise, structured, and focus on clear metrics and plans.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleContinue = async () => {
    if (selectedId) {
      try {
        await AsyncStorage.setItem('userPersonality', selectedId);
        await AsyncStorage.setItem('usageDays', '1');
        await AsyncStorage.setItem('lifestyleData', JSON.stringify({
          steps: 4200,
          exerciseMinutes: 25,
          sleepHours: 5.5
        }));
        router.push('/(tabs)/explore');
      } catch (e) {
        console.error("Failed to save data", e);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/app_bg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
          style={styles.overlay}
        />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type="title" style={styles.header}>Choose Your Coach</ThemedText>
          <ThemedText style={styles.subHeader}>
            Select the personality that motivates you the best.
          </ThemedText>

          <View style={styles.cardsContainer}>
            {PERSONALITIES.map((persona) => (
              <TouchableOpacity
                key={persona.id}
                onPress={() => setSelectedId(persona.id)}
                activeOpacity={0.8}
              >
                <BlurView
                  intensity={selectedId === persona.id ? 60 : 20}
                  tint={selectedId === persona.id ? 'systemThinMaterialLight' : 'dark'}
                  style={[
                    styles.card,
                    selectedId === persona.id && styles.selectedCard,
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <IconSymbol
                      name={persona.icon as any}
                      size={28}
                      color={selectedId === persona.id ? '#007AFF' : '#EEE'}
                    />
                    <ThemedText type="subtitle" style={[
                      styles.cardTitle,
                      selectedId === persona.id && styles.selectedCardTitle
                    ]}>
                      {persona.title}
                    </ThemedText>
                  </View>
                  <ThemedText style={[
                    styles.cardDescription,
                    selectedId === persona.id && styles.selectedCardDesc
                  ]}>
                    {persona.description}
                  </ThemedText>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, !selectedId && styles.disabledButton]}
            onPress={handleContinue}
            disabled={!selectedId}
          >
            <ThemedText style={styles.buttonText}>Start Chat</ThemedText>
          </TouchableOpacity>
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
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
    paddingTop: 60,
  },
  header: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subHeader: {
    fontSize: 17,
    textAlign: 'center',
    color: '#E0E0E0',
    marginBottom: 40,
    lineHeight: 24,
    fontWeight: '500',
    maxWidth: '85%',
    alignSelf: 'center',
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  selectedCard: {
    borderColor: '#007AFF',
    borderWidth: 2,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: 0.3,
  },
  cardDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#E0E0E0',
    fontWeight: '500',
  },
  selectedCardTitle: {
    color: '#007AFF',
  },
  selectedCardDesc: {
    color: '#333333',
    opacity: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
