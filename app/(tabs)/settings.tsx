// Settings Tab - Customize app
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  ScrollView
} from 'react-native';

export default function SettingsTab() {
  // State for settings
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);
  const [largeTextEnabled, setLargeTextEnabled] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>
      <Text style={styles.subtitle}>Customize your Metro Alert experience</Text>

      {/* Alert Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alert Settings</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>Vibration Alerts</Text>
            <Text style={styles.settingDescription}>Phone vibrates before your stop</Text>
          </View>
          <Switch
            value={vibrationEnabled}
            onValueChange={setVibrationEnabled}
            trackColor={{ false: '#ddd', true: '#3498db' }}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>Push Notifications</Text>
            <Text style={styles.settingDescription}>Show screen notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#ddd', true: '#3498db' }}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>SMS Alerts to Caregivers</Text>
            <Text style={styles.settingDescription}>Send SMS if stop is missed</Text>
          </View>
          <Switch
            value={smsAlertsEnabled}
            onValueChange={setSmsAlertsEnabled}
            trackColor={{ false: '#ddd', true: '#3498db' }}
          />
        </View>
      </View>

      

      {/* Alert Timing */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alert Timing</Text>
        <Text style={styles.instruction}>Alert me before my stop by:</Text>
        
        <View style={styles.timeOptions}>
          {['1 minute', '2 minutes', '3 minutes', '5 minutes'].map((time) => (
            <TouchableOpacity key={time} style={styles.timeButton}>
              <Text style={styles.timeButtonText}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>Help & Tutorial</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 30,
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    paddingRight: 10,
  },
  settingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  instruction: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 15,
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeButton: {
    backgroundColor: '#e8f4fc',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  timeButtonText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '500',
  },
  menuButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuButtonText: {
    fontSize: 16,
    color: '#3498db',
  },
});