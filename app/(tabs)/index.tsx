// Home Tab - This is your main screen
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity 
} from 'react-native';
import { Link } from 'expo-router';

export default function HomeTab() {
  return (
    <View style={styles.container}>
      {/* App Title */}
      <Text style={styles.title}>🚇 Metro Alert System</Text>
      <Text style={styles.subtitle}>Safe travel for deaf & memory-impaired users</Text>
      
      {/* Start Journey Button - This will go to a non-tab screen */}
      <Link href="/set-destination" asChild>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.buttonText}>Start New Journey</Text>
        </TouchableOpacity>
      </Link>
      
      {/* Quick Info */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>How it works:</Text>
        <Text style={styles.infoText}>1. Set your destination</Text>
        <Text style={styles.infoText}>2. Board the metro</Text>
        <Text style={styles.infoText}>3. Get vibration alerts before your stop</Text>
        <Text style={styles.infoText}>4. Caregiver notified if stop is missed</Text>
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
    backgroundColor: '#3498db',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 8,
    paddingLeft: 10,
  },
});