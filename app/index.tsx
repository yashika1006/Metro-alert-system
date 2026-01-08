// File: app/index.tsx
// This is your app's entry point - it will redirect to tabs

import { Redirect } from 'expo-router';
export default function Index() {
  // Redirect to the tabs layout
 
  return <Redirect href="/(tabs)" />;
}