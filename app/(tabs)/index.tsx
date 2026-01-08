import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity 
} from 'react-native';
import { Link } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function HomeTab() {
  const handleStartJourney = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      // Haptic feedback not available, continue anyway
    }
  };

  const handleSettingsPress = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Ignore error
    }
  };

  return (
    <View style={styles.container}>
      {/* App Title */}
      <Text style={styles.title}>🚇 Metro Alert System</Text>
      <Text style={styles.subtitle}>Safe travel for deaf & memory-impaired users</Text>
      
      {/* Start Journey Button */}
      <Link href="/set-destination" asChild>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleStartJourney}
        >
          <Text style={styles.buttonText}>Start New Journey</Text>
        </TouchableOpacity>
      </Link>
      
      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>🎯</Text>
          <Text style={styles.statText}>Accurate Alerts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>📳</Text>
          <Text style={styles.statText}>Vibration Alerts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>👥</Text>
          <Text style={styles.statText}>Caregiver Safety</Text>
        </View>
      </View>
      
      {/* How It Works */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>How it works:</Text>
        
        <View style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Set Your Destination</Text>
            <Text style={styles.stepDescription}>
              Enter start and end stations, select metro line
            </Text>
          </View>
        </View>
        
        <View style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Board the Metro</Text>
            <Text style={styles.stepDescription}>
              App tracks your journey in real-time
            </Text>
          </View>
        </View>
        
        <View style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Get Vibration Alerts</Text>
            <Text style={styles.stepDescription}>
              Phone vibrates before your stop (for deaf users)
            </Text>
          </View>
        </View>
        
        <View style={styles.stepContainer}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>4</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Safety Net</Text>
            <Text style={styles.stepDescription}>
              Caregiver notified automatically if stop is missed
            </Text>
          </View>
        </View>
      </View>
      
      {/* Emergency Info */}
      <View style={styles.emergencyBox}>
        <Text style={styles.emergencyTitle}>🚨 Emergency Feature</Text>
        <Text style={styles.emergencyText}>
          If you miss your stop or need help, the app will notify your caregivers immediately
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 40,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#2ecc71',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statNumber: {
    fontSize: 24,
    marginBottom: 8,
  },
  statText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  emergencyBox: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e67e22',
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: '#d35400',
    lineHeight: 20,
  },
});