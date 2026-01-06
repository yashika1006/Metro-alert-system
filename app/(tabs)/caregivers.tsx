// Caregivers Tab - Manage caretakers
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';

type Caregiver = {
  id: number;
  name: string;
  phone: string;
  relationship: string;
};

export default function CaregiversTab() {
  // State for caregivers list
  const [caregivers, setCaregivers] = useState<Caregiver[]>([
    { id: 1, name: 'Sarah Johnson', phone: '+1 (555) 123-4567', relationship: 'Daughter' },
    { id: 2, name: 'John Smith', phone: '+1 (555) 987-6543', relationship: 'Son' },
  ]);

  // State for new caregiver form
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRelationship, setNewRelationship] = useState('');

  // Function to add new caregiver
  const addCaregiver = () => {
    if (!newName || !newPhone) {
      Alert.alert('Error', 'Please enter name and phone number');
      return;
    }

    const newCaregiver: Caregiver = {
      id: caregivers.length + 1,
      name: newName,
      phone: newPhone,
      relationship: newRelationship || 'Caregiver',
    };

    setCaregivers([...caregivers, newCaregiver]);
    
    // Clear form
    setNewName('');
    setNewPhone('');
    setNewRelationship('');
    
    Alert.alert('Success', 'Caregiver added successfully');
  };

  // Function to remove caregiver
  const removeCaregiver = (id: number) => {
    Alert.alert(
      'Remove Caregiver',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setCaregivers(caregivers.filter(c => c.id !== id));
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>👥 Caregivers</Text>
      <Text style={styles.subtitle}>People to notify if you miss your stop</Text>

      {/* Add New Caregiver Form */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Add New Caregiver</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Name"
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
        
        <TouchableOpacity style={styles.addButton} onPress={addCaregiver}>
          <Text style={styles.addButtonText}>Add Caregiver</Text>
        </TouchableOpacity>
      </View>

      {/* Caregivers List */}
      <Text style={styles.listTitle}>Your Caregivers ({caregivers.length})</Text>
      
      {caregivers.length === 0 ? (
        <Text style={styles.emptyText}>No caregivers added yet</Text>
      ) : (
        caregivers.map((caregiver) => (
          <View key={caregiver.id} style={styles.caregiverCard}>
            <View style={styles.caregiverInfo}>
              <Text style={styles.caregiverName}>{caregiver.name}</Text>
              <Text style={styles.caregiverPhone}>{caregiver.phone}</Text>
              <Text style={styles.caregiverRelation}>{caregiver.relationship}</Text>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeCaregiver(caregiver.id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <Text style={styles.instructions}>
        These caregivers will receive SMS alerts if you miss your metro stop.
        Add at least one caregiver for safety.
      </Text>
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
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  formTitle: {
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
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#2ecc71',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    padding: 30,
  },
  caregiverCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  caregiverInfo: {
    flex: 1,
  },
  caregiverName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  caregiverPhone: {
    fontSize: 16,
    color: '#3498db',
    marginBottom: 5,
  },
  caregiverRelation: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  instructions: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
    lineHeight: 20,
  },
});