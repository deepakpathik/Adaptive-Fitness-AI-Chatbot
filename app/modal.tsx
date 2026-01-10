
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PERSONALITIES = [
  {
    id: 'Encouragement Seeker',
    title: 'Encouragement Seeker',
    icon: 'heart',
    color: '#FF69B4', // Pink
    description: 'Need a boost? I’ll provide constant reassurance, celebrate every win, and keep you positive.',
  },
  {
    id: 'Creative Explorer',
    title: 'Creative Explorer',
    icon: 'color-palette',
    color: '#34C759', // Green
    description: 'Bored easily? I’ll suggest fun, diverse activities to keep your fitness journey exciting.',
  },
  {
    id: 'Goal Finisher',
    title: 'Goal Finisher',
    icon: 'flag',
    color: '#007AFF', // Blue
    description: 'Love structure? I’ll be concise, metric-focused, and help you smash specific targets.',
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
        router.push('/chat');
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
          colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.85)']}
          style={styles.overlay}
        />

        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.8}
              style={styles.backButtonWrapper}
            >
              <BlurView intensity={30} tint="light" style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#FFF" />
              </BlurView>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.headerContainer}>
              <ThemedText type="title" style={styles.header}>Choose Your Coach</ThemedText>
              <ThemedText style={styles.subHeader}>
                Find the perfect personality to power your fitness journey.
              </ThemedText>
            </View>

            <View style={styles.cardsContainer}>
              {PERSONALITIES.map((persona) => {
                const isSelected = selectedId === persona.id;
                return (
                  <TouchableOpacity
                    key={persona.id}
                    onPress={() => setSelectedId(persona.id)}
                    activeOpacity={0.9}
                    style={styles.cardWrapper}
                  >
                    <BlurView
                      intensity={isSelected ? 40 : 20}
                      tint="dark"
                      style={[
                        styles.card,
                        isSelected && styles.selectedCardBorder
                      ]}
                    >
                      {isSelected && (
                        <LinearGradient
                          colors={[persona.color, 'transparent']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={[styles.cardGradientOverlay, { opacity: 0.15 }]}
                        />
                      )}

                      <View style={styles.cardContent}>
                        <View style={[styles.iconBox, { backgroundColor: isSelected ? '#FFF' : 'rgba(255,255,255,0.05)' }]}>
                          <Ionicons
                            name={persona.icon as any}
                            size={28}
                            color={persona.color}
                          />
                        </View>
                        <View style={styles.textStack}>
                          <ThemedText style={[styles.cardTitle, isSelected && { color: persona.color }]}>
                            {persona.title}
                          </ThemedText>
                          <ThemedText style={styles.cardDescription}>
                            {persona.description}
                          </ThemedText>
                        </View>
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={24} color={persona.color} style={styles.checkIcon} />
                        )}
                      </View>
                    </BlurView>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.buttonContainer, !selectedId && { opacity: 0.5 }]}
              onPress={handleContinue}
              disabled={!selectedId}
            >
              <LinearGradient
                colors={['#4c669f', '#3b5998', '#192f6a']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <ThemedText style={styles.buttonText}>Start Chat</ThemedText>
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  header: {
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subHeader: {
    fontSize: 16,
    textAlign: 'center',
    color: '#CCCCCC',
    lineHeight: 22,
    fontWeight: '400',
    maxWidth: '80%',
  },
  cardsContainer: {
    gap: 16,
  },
  cardWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 4,
  },
  card: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  selectedCardBorder: {
    borderColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1.5,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStack: {
    flex: 1,
  },
  cardTitle: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: '#AAA',
    fontWeight: '400',
  },
  checkIcon: {
    marginLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    shadowColor: '#4c669f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 20,
    marginTop: 10,
    zIndex: 10,
  },
  backButtonWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    width: 40,
    height: 40,
  },
  backButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
