import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useCaregivers } from '../context/CaregiverContext';

export default function CaregiversTab() {
  const { caregivers, addCaregiver, removeCaregiver, isLoading } = useCaregivers();
  
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRelationship, setNewRelationship] = useState('');

  const handleAddCaregiver = async () => {
    if (!newName.trim() || !newPhone.trim()) {
      Alert.alert('Error', 'Please enter name and phone number');
      return;
    }

    try {
      await addCaregiver({
        name: newName.trim(),
        phone: newPhone.trim(),
        relationship: newRelationship.trim() || 'Caregiver',
      });
      
      // Haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Clear form
      setNewName('');
      setNewPhone('');
      setNewRelationship('');
      
      Alert.alert('Success', 'Caregiver added successfully');
    } catch (error) {
      console.error('Failed to add caregiver:', error);
      Alert.alert('Error', 'Failed to add caregiver');
    }
  };

  const handleRemoveCaregiver = async (id: number) => {
    const caregiverToRemove = caregivers.find(c => c.id === id);
    
    if (!caregiverToRemove) {
      Alert.alert('Error', 'Caregiver not found');
      return;
    }
    
    Alert.alert(
      'Remove Caregiver',
      `Remove ${caregiverToRemove.name}?`,
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: async () => {
            try {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } catch (error) {
              // Ignore error
            }
          }
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeCaregiver(id);
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert('Removed', `${caregiverToRemove.name} has been removed`);
            } catch (error) {
              console.error('Failed to remove caregiver:', error);
              Alert.alert('Error', 'Failed to remove caregiver');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading caregivers...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>👥 Caregivers</Text>
      <Text style={styles.subtitle}>Manage emergency contacts</Text>

      {/* Add Caregiver Form */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Add New Caregiver</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={newName}
          onChangeText={setNewName}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={newPhone}
          onChangeText={setNewPhone}
          keyboardType="phone-pad"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Relationship (optional)"
          value={newRelationship}
          onChangeText={setNewRelationship}
        />
        
        <TouchableOpacity
          style={[
            styles.primaryButton,
            (!newName.trim() || !newPhone.trim()) && styles.disabledButton,
          ]}
          onPress={handleAddCaregiver}
          disabled={!newName.trim() || !newPhone.trim()}
        >
          <Text style={styles.primaryButtonText}>Add Caregiver</Text>
        </TouchableOpacity>
      </View>

      {/* Caregivers List */}
      <Text style={styles.sectionTitle}>
        Your Caregivers ({caregivers.length})
      </Text>
      
      {caregivers.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>👤</Text>
          <Text style={styles.emptyText}>No caregivers added yet</Text>
          <Text style={styles.emptySubText}>
            Add emergency contacts who should be notified if you miss your stop
          </Text>
        </View>
      ) : (
        caregivers.map(caregiver => (
          <View key={caregiver.id} style={styles.caregiverCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {caregiver.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            
            <View style={styles.caregiverInfo}>
              <Text style={styles.name}>{caregiver.name}</Text>
              <Text style={styles.phone}>{caregiver.phone}</Text>
              <Text style={styles.relation}>{caregiver.relationship}</Text>
            </View>
            
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveCaregiver(caregiver.id)}
            >
              <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      {/* Instructions */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>How Caregivers Help:</Text>
        <Text style={styles.infoText}>• Receive alerts if you miss your stop</Text>
        <Text style={styles.infoText}>• You can select which ones to notify per journey</Text>
        <Text style={styles.infoText}>• Data is automatically saved</Text>
        <Text style={styles.infoText}>• Add family, friends, or emergency contacts</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#7f8c8d',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#2ecc71',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
    opacity: 0.6,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  emptyBox: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
  },
  caregiverCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  caregiverInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  phone: {
    fontSize: 14,
    color: '#3498db',
    marginBottom: 2,
  },
  relation: {
    fontSize: 13,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  removeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#e8f4fc',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 6,
    marginLeft: 10,
  },
});