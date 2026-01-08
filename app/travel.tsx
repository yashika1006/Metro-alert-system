import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function TravelScreen() {
  // Journey states
  const [nextStop, setNextStop] = useState('Central Station');
  const [timeToStop, setTimeToStop] = useState(5); // minutes
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);
  
  // Simplified location states
  const [currentLocation, setCurrentLocation] = useState('Approaching Downtown Station');
  const [distanceToStop, setDistanceToStop] = useState('2.5 km');
  const [speed, setSpeed] = useState('35 km/h');
  const [isTracking, setIsTracking] = useState(true);

  // Simulate timer - counts down every 10 seconds for testing
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeToStop(prev => {
        if (prev > 0) {
          return prev - 1;
        }
        return 0;
      });
    }, 10000); // 10 seconds for testing

    return () => clearInterval(timer);
  }, []);

  // Trigger alert when 1 minute left
  useEffect(() => {
    if (timeToStop === 1 && !isAlertActive) {
      triggerAlert();
    }
  }, [timeToStop]);

  // Simulate location updates
  useEffect(() => {
    const locationInterval = setInterval(() => {
      // Simulate changing location data
      const locations = [
        { location: 'Approaching Downtown Station', distance: '2.5 km', speed: '35 km/h' },
        { location: 'Passing through Metro Tunnel', distance: '2.0 km', speed: '40 km/h' },
        { location: 'Near City Center', distance: '1.5 km', speed: '30 km/h' },
        { location: 'Close to Central Station', distance: '1.0 km', speed: '25 km/h' },
        { location: 'Approaching Central Station', distance: '0.5 km', speed: '20 km/h' },
      ];
      
      // Simulate progress along the route
      const progressIndex = Math.min(4, 4 - timeToStop);
      const currentProgress = locations[progressIndex];
      
      setCurrentLocation(currentProgress.location);
      setDistanceToStop(currentProgress.distance);
      setSpeed(currentProgress.speed);
      
    }, 15000); // Update every 15 seconds

    return () => clearInterval(locationInterval);
  }, [timeToStop]);

  // Function to trigger haptic alert
  const triggerAlert = async () => {
    setIsAlertActive(true);
    setIsVibrating(true);
    
    try {
      // Strong warning vibration
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      
      // Show visual alert
      Alert.alert(
        '🚨 STOP APPROACHING!',
        `Your stop ${nextStop} is in 1 minute!\nPhone is vibrating...`,
        [{ text: 'OK', onPress: () => setIsVibrating(false) }]
      );
      
      // Schedule repeated vibrations every 3 seconds for 15 seconds
      const vibrationInterval = setInterval(async () => {
        if (isVibrating) {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
      }, 3000);
      
      // Stop vibrations after 15 seconds
      setTimeout(() => {
        clearInterval(vibrationInterval);
        setIsVibrating(false);
      }, 15000);
      
    } catch (error) {
      console.log('Haptic error:', error);
      Alert.alert('Info', 'Haptics not available on this device');
    }
  };

  // Function to test different haptic patterns
  const testHaptic = async (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => {
    try {
      switch (type) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
      }
      Alert.alert('Haptic Test', `${type} vibration test successful!`);
    } catch (error) {
      console.log('Haptic test error:', error);
      Alert.alert('Info', 'Haptics not available on this device');
    }
  };

  // Toggle tracking (simulated)
  const toggleTracking = () => {
    setIsTracking(!isTracking);
    Alert.alert(
      isTracking ? 'Tracking Paused' : 'Tracking Resumed',
      isTracking 
        ? 'Location tracking has been paused.' 
        : 'Location tracking is now active.'
    );
  };

  const handleArrived = async () => {
    setIsVibrating(false);
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      // Ignore error for success haptic
    }
    
    Alert.alert(
      '🎉 Arrived Safely!',
      'Great! You reached your destination safely.',
      [{ text: 'OK', onPress: () => router.push('/(tabs)') }]
    );
  };

  const handleMissedStop = async () => {
    setIsVibrating(false);
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      // Ignore error for error haptic
    }
    
    Alert.alert(
      '📱 Caregiver Notified',
      'Your selected caregivers have been notified that you missed your stop.',
      [{ text: 'OK', onPress: () => router.push('/(tabs)') }]
    );
  };

  const handleEmergency = async () => {
    Alert.alert(
      '🚨 Emergency Alert',
      'This will immediately notify all your caregivers. Use only in emergencies.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Emergency Alert', 
          style: 'destructive', 
          onPress: async () => {
            try {
              // Strong emergency vibration pattern
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              await new Promise(resolve => setTimeout(resolve, 300));
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            } catch (error) {
              // Ignore error
            }
            
            Alert.alert('Sent', 'Emergency alert sent to all caregivers');
            router.push('/(tabs)');
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚇 Current Journey</Text>
      
      {/* Journey Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.routeText}>Red Line</Text>
        <Text style={styles.stopText}>Next Stop: {nextStop}</Text>
        <Text style={styles.timeText}>
          Arriving in: {timeToStop} minute{timeToStop !== 1 ? 's' : ''}
        </Text>
        
        {/* Location Tracking Info */}
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>📍 {currentLocation}</Text>
          <Text style={styles.locationText}>Distance to stop: {distanceToStop}</Text>
          <Text style={styles.locationText}>Current speed: {speed}</Text>
          
          <TouchableOpacity 
            style={styles.trackingButton} 
            onPress={toggleTracking}
          >
            <Text style={styles.trackingButtonText}>
              {isTracking ? '✅ Live Tracking ON' : '⏸️ Tracking PAUSED'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {timeToStop === 0 && (
          <Text style={styles.arrivedText}>You have arrived at your destination!</Text>
        )}
      </View>
      
      {/* Alert Display */}
      {isAlertActive && (
        <View style={styles.alertCard}>
          <Text style={styles.alertTitle}>⚠️ STOP APPROACHING!</Text>
          <Text style={styles.alertMessage}>
            Your stop {nextStop} is in 1 minute!
          </Text>
          <Text style={styles.alertMessage}>
            {isVibrating ? '📳 Phone is vibrating...' : 'Haptic alert sent'}
          </Text>
          
          <View style={styles.vibrationButtons}>
            <TouchableOpacity 
              style={styles.testVibrationButton} 
              onPress={() => testHaptic('warning')}
            >
              <Text style={styles.testVibrationText}>Test Warning</Text>
            </TouchableOpacity>
            
            {isVibrating && (
              <TouchableOpacity 
                style={styles.stopVibrationButton} 
                onPress={() => setIsVibrating(false)}
              >
                <Text style={styles.stopVibrationText}>Stop Vibration</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
      
      {/* Main Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.safeButton} 
          onPress={handleArrived}
          onLongPress={() => testHaptic('success')}
        >
          <Text style={styles.buttonText}>✅ I Arrived Safely</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.missedButton} 
          onPress={handleMissedStop}
          onLongPress={() => testHaptic('error')}
        >
          <Text style={styles.buttonText}>⏰ I Missed My Stop</Text>
        </TouchableOpacity>
      </View>
      
      {/* Emergency Button */}
      <TouchableOpacity 
        style={styles.emergencyButton} 
        onPress={handleEmergency}
        onLongPress={() => testHaptic('heavy')}
      >
        <Text style={styles.emergencyButtonText}>🚨 EMERGENCY ALERT</Text>
      </TouchableOpacity>
      
      {/* Haptic Test Controls */}
      <View style={styles.controlsCard}>
        <Text style={styles.controlsTitle}>Haptic Feedback Tests</Text>
        <Text style={styles.controlsText}>
          Test different vibration patterns for deaf users:
        </Text>
        
        <View style={styles.hapticButtons}>
          <TouchableOpacity 
            style={styles.hapticButtonLight} 
            onPress={() => testHaptic('light')}
          >
            <Text style={styles.hapticButtonText}>Light Tap</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.hapticButtonMedium} 
            onPress={() => testHaptic('medium')}
          >
            <Text style={styles.hapticButtonText}>Medium</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.hapticButtonHeavy} 
            onPress={() => testHaptic('heavy')}
          >
            <Text style={styles.hapticButtonText}>Heavy</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.hapticButtons}>
          <TouchableOpacity 
            style={styles.hapticButtonSuccess} 
            onPress={() => testHaptic('success')}
          >
            <Text style={styles.hapticButtonText}>Success</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.hapticButtonWarning} 
            onPress={() => testHaptic('warning')}
          >
            <Text style={styles.hapticButtonText}>Warning</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.hapticButtonError} 
            onPress={() => testHaptic('error')}
          >
            <Text style={styles.hapticButtonText}>Error</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.noteText}>
          Note: Haptics work best on real iOS/Android devices
        </Text>
      </View>
      
      {/* Instructions */}
      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>How this works:</Text>
        <Text style={styles.instructionsText}>• Timer counts down to your stop</Text>
        <Text style={styles.instructionsText}>• Strong warning vibration 1 minute before arrival</Text>
        <Text style={styles.instructionsText}>• "Missed Stop" triggers error vibration & notifies caregivers</Text>
        <Text style={styles.instructionsText}>• Emergency button for urgent situations</Text>
        <Text style={styles.instructionsText}>• Test different haptic patterns above</Text>
        <Text style={styles.instructionsText}>• Long-press buttons for extra haptic feedback</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 40,
    marginBottom: 30,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  routeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 10,
  },
  stopText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  timeText: {
    fontSize: 20,
    color: '#3498db',
    marginBottom: 15,
  },
  locationInfo: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  locationText: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 6,
  },
  trackingButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  trackingButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  arrivedText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginTop: 15,
    textAlign: 'center',
  },
  alertCard: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 3,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  alertTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e67e22',
    marginBottom: 10,
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: 16,
    color: '#d35400',
    textAlign: 'center',
    marginBottom: 5,
  },
  vibrationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 15,
  },
  testVibrationButton: {
    backgroundColor: '#f39c12',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  stopVibrationButton: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  testVibrationText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  stopVibrationText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    marginBottom: 15,
  },
  safeButton: {
    backgroundColor: '#2ecc71',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  missedButton: {
    backgroundColor: '#f39c12',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  emergencyButton: {
    backgroundColor: '#e74c3c',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#c0392b',
  },
  emergencyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  controlsCard: {
    backgroundColor: '#e8f4fc',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  controlsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  controlsText: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 15,
    lineHeight: 20,
  },
  hapticButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },
  hapticButtonLight: {
    backgroundColor: '#95a5a6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  hapticButtonMedium: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  hapticButtonHeavy: {
    backgroundColor: '#2c3e50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  hapticButtonSuccess: {
    backgroundColor: '#2ecc71',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  hapticButtonWarning: {
    backgroundColor: '#f39c12',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  hapticButtonError: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  hapticButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  noteText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  instructionsCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 5,
    marginLeft: 10,
  },
});