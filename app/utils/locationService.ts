// File: app/utils/locationService.ts
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export type LocationData = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  speed: number | null;
};

export class LocationService {
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'This app needs location access to track your metro journey and alert you at the right time.',
          [{ text: 'OK' }]
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.log('Permission request error:', error);
      return false;
    }
  }

  static async getCurrentLocation(): Promise<LocationData | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        speed: location.coords.speed,
      };
    } catch (error) {
      console.log('Get location error:', error);
      return null;
    }
  }

  static async startTracking(
    onLocationUpdate: (location: LocationData) => void,
    distanceInterval: number = 50 // meters
  ): Promise<() => void> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return () => {}; // Return empty cleanup function
      }

      // Start watching position
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: distanceInterval,
          timeInterval: 5000, // 5 seconds
        },
        (location) => {
          onLocationUpdate({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            speed: location.coords.speed,
          });
        }
      );

      // Return cleanup function
      return () => {
        subscription.remove();
      };
    } catch (error) {
      console.log('Start tracking error:', error);
      return () => {}; // Return empty cleanup function
    }
  }

  // Calculate distance between two coordinates (in meters)
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  // Mock metro station data (replace with real data for your city)
  static getMockStations() {
    return [
      { id: 1, name: 'Central Station', latitude: 40.7128, longitude: -74.0060 },
      { id: 2, name: 'Downtown Terminal', latitude: 40.7580, longitude: -73.9855 },
      { id: 3, name: 'North Plaza', latitude: 40.7829, longitude: -73.9654 },
      { id: 4, name: 'South Gate', latitude: 40.7505, longitude: -73.9934 },
      { id: 5, name: 'West End', latitude: 40.7614, longitude: -73.9776 },
    ];
  }

  // Find nearest station
  static findNearestStation(
    userLat: number,
    userLon: number
  ): { station: string; distance: number } {
    const stations = this.getMockStations();
    let nearestStation = stations[0];
    let minDistance = Infinity;

    for (const station of stations) {
      const distance = this.calculateDistance(
        userLat,
        userLon,
        station.latitude,
        station.longitude
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestStation = station;
      }
    }

    return {
      station: nearestStation.name,
      distance: Math.round(minDistance),
    };
  }
}