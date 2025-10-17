import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Location = { city: string; area?: string };

type LocationContextType = {
  location: Location;
  setLocation: (loc: Location) => void;
};

const DEFAULT_LOCATION: Location = { city: 'Yaoundé', area: 'Center' };

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<Location>(DEFAULT_LOCATION);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('g2g_location');
      if (raw) {
        const parsed = JSON.parse(raw) as Location;
        // Clamp to Yaoundé only
        setLocationState({ city: 'Yaoundé', area: parsed.area || 'Center' });
      }
    } catch {}
  }, []);

  const setLocation = (loc: Location) => {
    const clamped = { city: 'Yaoundé', area: loc.area || 'Center' } as Location;
    setLocationState(clamped);
    try { localStorage.setItem('g2g_location', JSON.stringify(clamped)); } catch {}
  };

  const value = useMemo(() => ({ location, setLocation }), [location]);
  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export function useLocationCtx(): LocationContextType {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocationCtx must be used within LocationProvider');
  return ctx;
}
