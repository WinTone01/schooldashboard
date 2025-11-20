"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useTimeSync } from '@/hooks/use-time-sync';
import { useSettings, Settings, DEFAULT_SETTINGS } from '@/hooks/use-persistent-state';

interface AppState {
  now: Date;
  isSynced: boolean;
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  isExamMode: boolean;
  setExamMode: (mode: boolean) => void;
  examConfig: any | null;
  setExamConfig: (config: any | null) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { now, isSynced } = useTimeSync();
  const { settings, updateSettings } = useSettings();
  const [isExamMode, setExamMode] = useState(false);
  const [examConfig, setExamConfig] = useState<any | null>(null);

  // Load exam config from local storage
  useEffect(() => {
    const savedExam = localStorage.getItem('dersProgramiExamConfig');
    if (savedExam) {
      try {
        const parsed = JSON.parse(savedExam);
        if (parsed.examMode && parsed.examConfig) {
          setExamMode(parsed.examMode);
          setExamConfig(parsed.examConfig);
        }
      } catch (e) {
        console.error("Failed to load exam config", e);
      }
    }
  }, []);

  // Persist exam config
  useEffect(() => {
    if (isExamMode && examConfig) {
      localStorage.setItem('dersProgramiExamConfig', JSON.stringify({ examMode: isExamMode, examConfig }));
    } else {
      localStorage.removeItem('dersProgramiExamConfig');
    }
  }, [isExamMode, examConfig]);

  return (
    <AppContext.Provider value={{ 
      now, 
      isSynced, 
      settings: settings || DEFAULT_SETTINGS, 
      updateSettings,
      isExamMode,
      setExamMode,
      examConfig,
      setExamConfig
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

