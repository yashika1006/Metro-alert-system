// hooks/useLiveLocation.ts

import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export const useLiveLocation = () => {
  const [location, setLocation] =
    useState<Location.LocationObject | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription;

    const start = async () => {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError('Location permission denied');
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 10,
        },
        (loc) => setLocation(loc)
      );
    };

    start();

    return () => {
      subscription?.remove();
    };
  }, []);

  return { location, error };
};
