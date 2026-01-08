import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';

// Mock caregiver data
const mockCaregivers = [
  { id: 1, name: 'Sarah Johnson', phone: '+1 (555) 123-4567' },
  { id: 2, name: 'John Smith', phone: '+1 (555) 987-6543' },
  { id: 3, name: 'Emergency Contact', phone: '+1 (555) 911-0000' },
];

export default function SetDestinationScreen() {
  const [startStation, setStartStation] = useState('');
  const [endStation, setEndStation] = useState('');
  const [selectedLine, setSelectedLine] = useState('');
  const [selectedCaregivers, setSelectedCaregivers] = useState<number[]>([]);
  const [customNumber, setCustomNumber] = useState('');

  const metroLines = ['Red Line', 'Blue Line', 'Green Line', 'Yellow Line'];

  // Check location permission
  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        return newStatus === 'granted';
      }
      
      return true;
    } catch (error) {
      console.log('Permission check error:', error);
      Alert.alert('Error', 'Failed to check location permission');
      return false;
    }
  };

  // Function to start the journey
  const startJourney = async () => {
    // Show summary before starting
    const caregiverCount = selectedCaregivers.length;
    const hasCustom = customNumber ? 1 : 0;
    const totalCaregivers = caregiverCount + hasCustom;
    
    Alert.alert(
      'Start Journey?',
      `From: ${startStation || 'Not set'}\nTo: ${endStation || 'Not set'}\nLine: ${selectedLine || 'Not selected'}\nCaregivers to notify: ${totalCaregivers}`,
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: async () => {
            try {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            } catch (error) {
              // Ignore error
            }
          }
        },
        { 
          text: 'Start Journey', 
          onPress: async () => {
            try {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              // Ignore error
            }
            
            // Save journey data
            const journeyData = {
              startStation,
              endStation,
              metroLine: selectedLine,
              caregivers: selectedCaregivers,
              customNumber,
              startTime: new Date().toISOString(),
            };
            console.log('Journey started:', journeyData);
            
            // Navigate to travel screen
            router.push('/travel');
          }
        },
      ]
    );
  };

  // Handle start journey with permission check
  const handleStartJourney = async () => {
    if (!startStation || !endStation) {
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch (error) {
        // Ignore error
      }
      Alert.alert('Missing Information', 'Please enter both start and destination stations');
      return;
    }

    // Check location permission
    const hasPermission = await checkLocationPermission();
    if (hasPermission) {
      startJourney();
    } else {
      Alert.alert(
        'Location Required',
        'Location access is needed for accurate stop alerts. You can enable it in Settings.',
        [{ text: 'OK' }]
      );
    }
  };

  // Toggle caregiver selection with haptic
  const toggleCaregiver = async (id: number) => {
    const newSelection = selectedCaregivers.includes(id) 
      ? selectedCaregivers.filter(cid => cid !== id)
      : [...selectedCaregivers, id];
    
    setSelectedCaregivers(newSelection);
    
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Ignore error
    }
  };

  // Handle metro line selection with haptic
  const handleLineSelect = async (line: string) => {
    setSelectedLine(line);
    
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      // Ignore error
    }
  };

  // Handle cancel with haptic
  const handleCancel = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Ignore error
    }
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🚇 Set Your Journey</Text>
      
      {/* Start Station */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Starting Station</Text>
        <TextInput
          style={styles.input}
          placeholder="Where are you getting on?"
          value={startStation}
          onChangeText={setStartStation}
          placeholderTextColor="#95a5a6"
        />
      </View>
      
      {/* Destination Station */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Destination Station</Text>
        <TextInput
          style={styles.input}
          placeholder="Where do you want to go?"
          value={endStation}
          onChangeText={setEndStation}
          placeholderTextColor="#95a5a6"
        />
      </View>
      
      {/* Metro Line Selection */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Select Metro Line</Text>
        <View style={styles.linesContainer}>
          {metroLines.map((line) => (
            <TouchableOpacity 
              key={line} 
              style={[
                styles.lineButton,
                selectedLine === line && styles.lineButtonSelected
              ]}
              onPress={() => handleLineSelect(line)}
            >
              <Text style={[
                styles.lineText,
                selectedLine === line && styles.lineTextSelected
              ]}>
                {line}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Caregiver Selection */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Notify Caregivers if Stop is Missed</Text>
        <Text style={styles.helperText}>
          Select from your saved caregivers
        </Text>
        
        {/* Saved Caregivers */}
        <View style={styles.caregiversContainer}>
          {mockCaregivers.map((caregiver) => (
            <TouchableOpacity 
              key={caregiver.id}
              style={[
                styles.caregiverButton,
                selectedCaregivers.includes(caregiver.id) && styles.caregiverButtonSelected
              ]}
              onPress={() => toggleCaregiver(caregiver.id)}
            >
              <View style={styles.caregiverContent}>
                <View style={[
                  styles.checkbox,
                  selectedCaregivers.includes(caregiver.id) && styles.checkboxSelected
                ]}>
                  {selectedCaregivers.includes(caregiver.id) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <View style={styles.caregiverInfo}>
                  <Text style={styles.caregiverName}>{caregiver.name}</Text>
                  <Text style={styles.caregiverPhone}>{caregiver.phone}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Or Add Custom Number */}
        <Text style={[styles.helperText, { marginTop: 15 }]}>
          Or enter a custom number:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="+1 234 567 8900 (optional)"
          value={customNumber}
          onChangeText={setCustomNumber}
          keyboardType="phone-pad"
          placeholderTextColor="#95a5a6"
        />
      </View>
      
      {/* Summary */}
      {(selectedCaregivers.length > 0 || customNumber) && (
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>📱 Caregivers to notify:</Text>
          {selectedCaregivers.map(id => {
            const caregiver = mockCaregivers.find(c => c.id === id);
            return caregiver ? (
              <Text key={id} style={styles.summaryText}>• {caregiver.name}</Text>
            ) : null;
          })}
          {customNumber && (
            <Text style={styles.summaryText}>• Custom: {customNumber}</Text>
          )}
        </View>
      )}
      
      {/* Location Permission Note */}
      <View style={styles.permissionNote}>
        <Text style={styles.permissionText}>
          📍 Location access is required for accurate stop alerts and timing
        </Text>
      </View>
      
      {/* Action Buttons */}
      <TouchableOpacity 
        style={[
          styles.startButton,
          (!startStation || !endStation) && styles.startButtonDisabled
        ]} 
        onPress={handleStartJourney}
        disabled={!startStation || !endStation}
      >
        <Text style={styles.startButtonText}>Start Journey</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.cancelButton} 
        onPress={handleCancel}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 40,
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#2c3e50',
  },
  linesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 5,
  },
  lineButton: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  lineButtonSelected: {
    backgroundColor: '#2ecc71',
    borderColor: '#27ae60',
  },
  lineText: {
    color: '#3498db',
    fontWeight: '600',
    fontSize: 15,
  },
  lineTextSelected: {
    color: 'white',
  },
  caregiversContainer: {
    marginTop: 10,
  },
  caregiverButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  caregiverButtonSelected: {
    backgroundColor: '#e8f6f3',
    borderColor: '#2ecc71',
  },
  caregiverContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#95a5a6',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#2ecc71',
    borderColor: '#27ae60',
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  caregiverInfo: {
    flex: 1,
  },
  caregiverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  caregiverPhone: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  summaryBox: {
    backgroundColor: '#e8f4fc',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 4,
    marginLeft: 10,
  },
  permissionNote: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  permissionText: {
    fontSize: 13,
    color: '#d35400',
    textAlign: 'center',
    lineHeight: 18,
  },
  startButton: {
    backgroundColor: '#2ecc71',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonDisabled: {
    backgroundColor: '#95a5a6',
    opacity: 0.6,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 40,
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontSize: 16,
  },
});