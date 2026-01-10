
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

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
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.header}>Choose Your Coach</ThemedText>
        <ThemedText style={styles.subHeader}>
          Select the personality that motivates you the best.
        </ThemedText>

        <View style={styles.cardsContainer}>
          {PERSONALITIES.map((persona) => (
            <TouchableOpacity
              key={persona.id}
              style={[
                styles.card,
                selectedId === persona.id && styles.selectedCard,
              ]}
              onPress={() => setSelectedId(persona.id)}
            >
              <View style={styles.cardHeader}>
                <IconSymbol
                  name={persona.icon as any}
                  size={24}
                  color={selectedId === persona.id ? '#fff' : '#007AFF'}
                />
                <ThemedText type="subtitle" style={[
                  styles.cardTitle,
                  selectedId === persona.id && styles.selectedText
                ]}>
                  {persona.title}
                </ThemedText>
              </View>
              <ThemedText style={[
                styles.cardDescription,
                selectedId === persona.id && styles.selectedText
              ]}>
                {persona.description}
              </ThemedText>
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
          <ThemedText style={styles.buttonText}>Continue</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 32,
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  cardTitle: {
    color: '#000000',
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
  selectedText: {
    color: '#fff',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
