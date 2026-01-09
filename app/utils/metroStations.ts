export type MetroStation = {
  name: string;
  line: 'Red' | 'Blue' | 'Yellow';
  latitude: number;
  longitude: number;
};

export const metroStations: MetroStation[] = [
  // RED LINE
  { name: 'Rithala', line: 'Red', latitude: 28.7075, longitude: 77.1117 },
  { name: 'Netaji Subhash Place', line: 'Red', latitude: 28.7026, longitude: 77.1100 },
  { name: 'Rajouri Garden', line: 'Red', latitude: 28.6491, longitude: 77.1148 },
  { name: 'Central Secretariat', line: 'Red', latitude: 28.6139, longitude: 77.2100 },
  { name: 'Dilshad Garden', line: 'Red', latitude: 28.6730, longitude: 77.2700 },

  // BLUE LINE
  { name: 'Dwarka Sector 21', line: 'Blue', latitude: 28.5783, longitude: 77.0470 },
  { name: 'Rajiv Chowk', line: 'Blue', latitude: 28.6333, longitude: 77.2192 },
  { name: 'Noida City Centre', line: 'Blue', latitude: 28.5707, longitude: 77.3762 },
  { name: 'Yamuna Bank', line: 'Blue', latitude: 28.6462, longitude: 77.2903 },

  // YELLOW LINE
  { name: 'Samaypur Badli', line: 'Yellow', latitude: 28.7286, longitude: 77.1160 },
  { name: 'Civil Lines', line: 'Yellow', latitude: 28.6678, longitude: 77.2197 },
  { name: 'Huda City Centre', line: 'Yellow', latitude: 28.4595, longitude: 77.0728 },
];
