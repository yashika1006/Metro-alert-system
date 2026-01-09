import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function SetDestination() {
  const router = useRouter();
  const [selectedLine, setSelectedLine] = useState<'Red' | 'Blue' | 'Yellow' | null>(null);

  const goToTravel = () => {
    if (!selectedLine) return;

    router.push({
      pathname: '/TravelScreen',
      params: { line: selectedLine },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Metro Line</Text>

      {(['Red', 'Blue', 'Yellow'] as const).map((line) => (
        <TouchableOpacity
          key={line}
          style={[styles.lineButton, selectedLine === line && styles.selected]}
          onPress={() => setSelectedLine(line)}
        >
          <Text style={styles.lineText}>{line} Line</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.nextButton, !selectedLine && styles.disabled]}
        disabled={!selectedLine}
        onPress={goToTravel}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  lineButton: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#e0e7ff',
    borderColor: '#6366f1',
  },
  lineText: { fontSize: 18 },
  nextButton: {
    marginTop: 20,
    backgroundColor: '#4f46e5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  disabled: { opacity: 0.5 },
});
