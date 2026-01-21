'use client';

import { createContext, useContext, useState } from 'react';

interface ImmersiveModeContextType {
  isImmersive: boolean;
  toggle: () => void;
}

const ImmersiveModeContext = createContext<ImmersiveModeContextType | null>(null);

export function ImmersiveModeProvider({ children }: { children: React.ReactNode }) {
  const [isImmersive, setIsImmersive] = useState(false);

  return (
    <ImmersiveModeContext.Provider value={{ isImmersive, toggle: () => setIsImmersive(!isImmersive) }}>
      {children}
    </ImmersiveModeContext.Provider>
  );
}

export function useImmersiveMode() {
  const context = useContext(ImmersiveModeContext);
  if (!context) throw new Error('useImmersiveMode must be used within ImmersiveModeProvider');
  return context;
}
