import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

type Caregiver = {
  id: number;
  name: string;
  phone: string;
  relationship: string;
};

export default function CaregiversTab() {
  const idCounter = useRef(1);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRelationship, setNewRelationship] = useState('');

  const addCaregiver = () => {
    if (!newName || !newPhone) {
      Alert.alert('Error', 'Please enter name and phone number');
      return;
    }

    const newCaregiver: Caregiver = {
      id: idCounter.current++,
      name: newName.trim(),
      phone: newPhone.trim(),
      relationship: newRelationship.trim() || 'Caregiver',
    };

    setCaregivers([...caregivers, newCaregiver]);
    setNewName('');
    setNewPhone('');
    setNewRelationship('');

    Alert.alert('Success', `${newCaregiver.name} added`);
  };

  const removeCaregiver = (id: number) => {
    const caregiver = caregivers.find(c => c.id === id);
    
    Alert.alert(
      'Remove Caregiver',
      `Remove ${caregiver?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setCaregivers(currentCaregivers => 
              currentCaregivers.filter(caregiver => caregiver.id !== id)
            );
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>👥 Caregivers</Text>
      <Text style={styles.subtitle}>
        Contacts to notify if you miss your stop
      </Text>

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
            (!newName || !newPhone) && styles.disabledButton,
          ]}
          onPress={addCaregiver}
          disabled={!newName || !newPhone}
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
          <Text style={styles.emptyText}>No caregivers added</Text>
          <Text style={styles.emptySubText}>
            Add family, friends, or emergency contacts
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
              onPress={() => removeCaregiver(caregiver.id)}
            >
              <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      {/* Info Section */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>How Caregivers Help:</Text>
        <Text style={styles.infoText}>
          • Receive SMS alerts if you miss your stop
        </Text>
        <Text style={styles.infoText}>
          • You can choose which caregivers to notify for each journey
        </Text>
        <Text style={styles.infoText}>
          • Emergency safety backup system
        </Text>
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
    fontSize: 26,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 25,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#2c3e50',
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
    marginTop: 5,
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
    fontWeight: '600',
    marginBottom: 15,
    color: '#2c3e50',
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
    fontSize: 16,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: '#3498db',
    marginBottom: 3,
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
    fontSize: 18,
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