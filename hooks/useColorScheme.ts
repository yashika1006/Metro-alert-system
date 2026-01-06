// File: hooks/useColorScheme.ts
import { useColorScheme as _useColorScheme } from 'react-native';

// This hook returns the current color scheme
export function useColorScheme(): 'light' | 'dark' {
  // Get the color scheme from React Native
  const colorScheme = _useColorScheme();
  
  // If it's null or undefined, default to 'light'
  return colorScheme === 'dark' ? 'dark' : 'light';
}