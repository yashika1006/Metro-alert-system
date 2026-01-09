// travel/TravelScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { metroStations, type MetroStation } from './utils/metroStations';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function TravelScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams<{ line: string }>();
  const line = searchParams.line; // metro line passed from set-destination page

  const [selectedStation, setSelectedStation] =
    useState<MetroStation | null>(null);

  const filteredStations = line
    ? metroStations.filter((station) => station.line === line)
    : metroStations;

  const startJourney = () => {
    if (!selectedStation) return;

    router.push({
      pathname: '/journey/JourneyScreen',
      params: {
        destination: JSON.stringify(selectedStation),
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Destination - {line} Line</Text>

      <FlatList
        data={filteredStations}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.station,
              selectedStation?.name === item.name && styles.selected,
            ]}
            onPress={() => setSelectedStation(item)}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={[styles.button, !selectedStation && styles.disabled]}
        disabled={!selectedStation}
        onPress={startJourney}
      >
        <Text style={styles.buttonText}>Start Journey</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: '600',
  },
  station: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
  },
  selected: {
    backgroundColor: '#e0e7ff',
    borderColor: '#6366f1',
  },
  button: {
    marginTop: 12,
    backgroundColor: '#4f46e5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
