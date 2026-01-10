
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router'; // Use expo-router hook
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>Adaptive Fitness AI</ThemedText>
        <ThemedText style={styles.subtitle}>
          Your personal AI coach that adapts to your personality and lifestyle.
        </ThemedText>

        <View style={styles.infoContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>I can help with:</ThemedText>
          <View style={styles.bulletPoint}>
            <IconSymbol name="checkmark.circle.fill" size={20} color="#4CAF50" />
            <ThemedText style={styles.bulletText}>Personalized workout plans</ThemedText>
          </View>
          <View style={styles.bulletPoint}>
            <IconSymbol name="checkmark.circle.fill" size={20} color="#4CAF50" />
            <ThemedText style={styles.bulletText}>Wellness & habit guidance</ThemedText>
          </View>
          <View style={styles.bulletPoint}>
            <IconSymbol name="checkmark.circle.fill" size={20} color="#4CAF50" />
            <ThemedText style={styles.bulletText}>Motivation & accountability</ThemedText>
          </View>
        </View>

        <View style={styles.warningContainer}>
          <ThemedText type="subtitle" style={styles.warningTitle}>⚠️ Important Note:</ThemedText>
          <ThemedText style={styles.warningText}>
            I cannot provide medical advice, diagnosis, or treatment for injuries or diseases.
          </ThemedText>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/onboarding')} // Navigate to onboarding (will create next)
        >
          <ThemedText style={styles.buttonText}>Start Chat</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  infoContainer: {
    width: '100%',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  bulletText: {
    fontSize: 16,
  },
  warningContainer: {
    backgroundColor: '#FFF3CD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 40,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  warningTitle: {
    fontSize: 16,
    marginBottom: 4,
    color: '#856404',
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
