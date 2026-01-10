import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Animated, ImageBackground, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();

  // Animation for the sprinter to make it look "in motion" (subtle horizontal drift/vibration)
  const translateX = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: 5,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -5,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={require('@/assets/images/app_bg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
          style={styles.overlay}
        />

        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.content}>

            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Animated.Image
                  source={require('@/assets/images/sprinter.png')}
                  style={[
                    styles.sprinterIcon,
                    { transform: [{ skewX: '-10deg' }, { translateX }] }
                  ]}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>Ready to Crush It,{'\n'}Athlete?</Text>
                <Text style={styles.subtitle}>Your adaptive, goal-oriented AI coach is here.</Text>
              </View>
            </View>

            {/* Feature Grid */}
            <View style={styles.grid}>
              <FeatureCard
                icon="barbell-outline"
                title="Personalized Plans"
                desc="Tailored for your goals."
              />
              <FeatureCard
                icon="bulb-outline"
                title="Smart Coaching"
                desc="Adapts to your progress."
              />
              <FeatureCard
                icon="trending-up-outline"
                title="Progress Insights"
                desc="Visualize your gains."
              />
              <FeatureCard
                icon="heart-outline"
                title="Wellness & Recovery"
                desc="Balance rest and work."
              />
            </View>

            {/* Bottom Footer Section */}
            <View style={styles.bottomSection}>
              {/* Disclaimer */}
              <View style={styles.disclaimerContainer}>
                <Ionicons name="information-circle-outline" size={22} color="#FFD700" style={{ marginRight: 8 }} />
                <Text style={styles.disclaimerText}>
                  Note: I’m here to help with fitness and wellness guidance only. I can’t help with medical conditions, injuries, or medications. Please reach out to a healthcare professional for those needs.
                </Text>
              </View>

              {/* CTA Button */}
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => router.push('/modal')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#4c669f', '#3b5998', '#192f6a']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Get Started</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const FeatureCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <View style={styles.card}>
    <LinearGradient
      colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
      style={styles.cardGradient}
    />
    <View style={styles.cardIconBox}>
      <Ionicons name={icon} size={24} color="#FFD700" />
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDesc}>{desc}</Text>
  </View>
);

import { Text } from 'react-native'; // Import Text separately for custom styles

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
  content: {
    paddingHorizontal: 20,
    paddingTop: 10, // minimized top padding
    paddingBottom: 20,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 5,
  },
  iconContainer: {
    width: '100%',
    height: 220, // Enlarged from 160
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  sprinterIcon: {
    width: '100%',
    height: '100%',
    transform: [{ skewX: '-10deg' }], // Static "speed" skew
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28, // Reduced from 34 to save space
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12, // Increased spacing to shift subtitle down
    lineHeight: 32,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 14, // Reduced from 17
    color: '#E0E0E0',
    textAlign: 'center',
    maxWidth: '95%',
    lineHeight: 18,
    fontWeight: '500',
    opacity: 0.9,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10, // Reduced gap
    justifyContent: 'center',
    marginBottom: 5,
    flex: 1,
    alignContent: 'center',
  },
  card: {
    width: '48%',
    borderRadius: 16,
    paddingVertical: 12, // Reduced from 20 to fit screen
    paddingHorizontal: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'center',
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
  },
  cardIconBox: {
    marginBottom: 6,
    backgroundColor: 'rgba(255,215,0,0.1)',
    alignSelf: 'flex-start',
    padding: 6,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  cardDesc: {
    fontSize: 11,
    color: '#CCCCCC',
    lineHeight: 14,
    fontWeight: '400',
  },
  bottomSection: {
    width: '100%',
    marginTop: 'auto',
    gap: 8,
  },
  disclaimerContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8, // Reduced padding
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  disclaimerText: {
    color: '#FFD700',
    fontSize: 11,
    flex: 1,
    lineHeight: 14,
  },
  buttonContainer: {
    width: '100%',
    shadowColor: '#4c669f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    marginBottom: 0,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
