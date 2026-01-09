import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Caregiver = {
  id: number;
  name: string;
  phone: string;
  relationship: string;
};

type CaregiverContextType = {
  caregivers: Caregiver[];
  addCaregiver: (caregiver: Omit<Caregiver, 'id'>) => Promise<void>;
  removeCaregiver: (id: number) => Promise<void>;
  updateCaregiver: (id: number, caregiver: Partial<Caregiver>) => Promise<void>;
  isLoading: boolean;
};

const CaregiverContext = createContext<CaregiverContextType | undefined>(undefined);

const STORAGE_KEY = '@metro_alert_caregivers';

export function CaregiverProvider({ children }: { children: ReactNode }) {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextId, setNextId] = useState(1000);

  // Load caregivers from storage on startup
  useEffect(() => {
    loadCaregivers();
  }, []);

  const loadCaregivers = async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCaregivers(parsed.caregivers || []);
        setNextId(parsed.nextId || 1000);
      }
    } catch (error) {
      console.error('Failed to load caregivers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCaregivers = async (newCaregivers: Caregiver[], newNextId: number) => {
    try {
      const data = {
        caregivers: newCaregivers,
        nextId: newNextId,
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save caregivers:', error);
    }
  };

  const addCaregiver = async (caregiverData: Omit<Caregiver, 'id'>) => {
    const newCaregiver: Caregiver = {
      id: nextId,
      ...caregiverData,
    };
    
    const newCaregivers = [...caregivers, newCaregiver];
    const newNextId = nextId + 1;
    
    setCaregivers(newCaregivers);
    setNextId(newNextId);
    await saveCaregivers(newCaregivers, newNextId);
    
    console.log('✅ Added caregiver:', newCaregiver);
  };

  const removeCaregiver = async (id: number) => {
    const newCaregivers = caregivers.filter(c => c.id !== id);
    
    setCaregivers(newCaregivers);
    await saveCaregivers(newCaregivers, nextId);
    
    console.log('✅ Removed caregiver ID:', id);
  };

  const updateCaregiver = async (id: number, updates: Partial<Caregiver>) => {
    const newCaregivers = caregivers.map(c => 
      c.id === id ? { ...c, ...updates } : c
    );
    
    setCaregivers(newCaregivers);
    await saveCaregivers(newCaregivers, nextId);
    
    console.log('✅ Updated caregiver ID:', id, 'with:', updates);
  };

  return (
    <CaregiverContext.Provider
      value={{
        caregivers,
        addCaregiver,
        removeCaregiver,
        updateCaregiver,
        isLoading,
      }}
    >
      {children}
    </CaregiverContext.Provider>
  );
}

export function useCaregivers() {
  const context = useContext(CaregiverContext);
  if (context === undefined) {
    throw new Error('useCaregivers must be used within a CaregiverProvider');
  }
  return context;
}

// Export everything
// export { CaregiverProvider, useCaregivers, type Caregiver };

// Export as default for Expo Router
// export default CaregiverProvider;.