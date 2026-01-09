import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getDistance } from '../utils/distance';
import type { MetroStation } from '../utils/metroStations';

export default function JourneyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ destination: string }>();
  
  const destination: MetroStation = params.destination
    ? JSON.parse(params.destination)
    : { name: '', latitude: 0, longitude: 0 };

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [distanceToStop, setDistanceToStop] = useState(0);
  const [isVibrating, setIsVibrating] = useState(false);
  const vibrationInterval = useRef<number | null>(null);


  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest, distanceInterval: 5 },
        (loc) => setLocation(loc)
      );

      return () => sub.remove();
    })();

    return () => {
      if (vibrationInterval.current) clearInterval(vibrationInterval.current);
    };
  }, []);

  useEffect(() => {
    if (!location) return;

    const dist = getDistance(
      location.coords.latitude,
      location.coords.longitude,
      destination.latitude,
      destination.longitude
    );

    setDistanceToStop(dist);

    if (dist <= 50 && !isVibrating) {
      setIsVibrating(true);

      vibrationInterval.current = setInterval(async () => {
        try {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        } catch (e) {}
      }, 3000);

      setTimeout(() => {
        setIsVibrating(false);
        if (vibrationInterval.current) clearInterval(vibrationInterval.current);
      }, 15000);
    }
  }, [location]);

  const handleArrived = async () => {
    setIsVibrating(false);
    if (vibrationInterval.current) clearInterval(vibrationInterval.current);

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}

    Alert.alert('🎉 Arrived Safely!', `You have arrived at ${destination.name}`, [
      { text: 'OK', onPress: () => router.push('/(tabs)') },
    ]);
  };

  const handleMissedStop = async () => {
    setIsVibrating(false);
    if (vibrationInterval.current) clearInterval(vibrationInterval.current);

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {}

    Alert.alert('📱 Caregiver Notified', `You missed ${destination.name}`, [
      { text: 'OK', onPress: () => router.push('/(tabs)') },
    ]);
  };

  if (!location) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Waiting for GPS signal…</Text>
        {errorMsg ? <Text>{errorMsg}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚇 Journey to {destination.name}</Text>
      <Text style={styles.infoText}>
        Current Location: {location.coords.latitude.toFixed(5)}, {location.coords.longitude.toFixed(5)}
      </Text>
      <Text style={styles.infoText}>
        Distance to stop: {distanceToStop.toFixed(1)} meters
      </Text>
      {isVibrating && <Text style={styles.vibrationText}>📳 Phone vibrating...</Text>}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.safeButton} onPress={handleArrived}>
          <Text style={styles.buttonText}>✅ I Arrived Safely</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.missedButton} onPress={handleMissedStop}>
          <Text style={styles.buttonText}>⏰ I Missed My Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  loadingText: { fontSize: 18, textAlign: 'center', marginTop: 100 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  infoText: { fontSize: 16, marginBottom: 10 },
  vibrationText: { fontSize: 16, fontWeight: 'bold', color: '#e74c3c', marginBottom: 15 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  safeButton: { backgroundColor: '#2ecc71', padding: 16, borderRadius: 10, flex: 1, marginRight: 10, alignItems: 'center' },
  missedButton: { backgroundColor: '#f39c12', padding: 16, borderRadius: 10, flex: 1, marginLeft: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
});
