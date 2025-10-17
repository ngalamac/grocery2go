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
      if (raw) setLocationState(JSON.parse(raw));
    } catch {}
  }, []);

  const setLocation = (loc: Location) => {
    setLocationState(loc);
    try { localStorage.setItem('g2g_location', JSON.stringify(loc)); } catch {}
  };

  const value = useMemo(() => ({ location, setLocation }), [location]);
  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export function useLocationCtx(): LocationContextType {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocationCtx must be used within LocationProvider');
  return ctx;
}
