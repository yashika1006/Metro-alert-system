import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

export default function SettingsScreen() {
  const [longVibration, setLongVibration] = useState(true);
  const [strongHaptics, setStrongHaptics] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.option}>
        <Text style={styles.label}>Long vibration alerts</Text>
        <Switch value={longVibration} onValueChange={setLongVibration} />
      </View>

      <View style={styles.option}>
        <Text style={styles.label}>Strong haptic intensity</Text>
        <Switch value={strongHaptics} onValueChange={setStrongHaptics} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  label: { fontSize: 16 },
});
