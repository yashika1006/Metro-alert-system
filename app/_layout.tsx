// File: app/_layout.tsx
import { Stack } from 'expo-router';
import { CaregiverProvider } from './context/CaregiverContext';

export default function RootLayout() {
  return (
    <CaregiverProvider>
      <Stack />
    </CaregiverProvider>
  );
}