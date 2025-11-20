import { useState, useEffect } from 'react';

export interface Lesson {
  name: string;
  start: string;
  end: string;
  breakAfter: string | null;
  breakLabel?: string;
  isLunch?: boolean;
}

export interface WatchDutySchedule {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}

export interface WatchDuties {
  locations: string[];
  schedule: WatchDutySchedule;
}

export interface ExamConfig {
  verbalStart: string;
  verbalEnd: string;
  breakDuration: number;
  mathStart: string;
  mathEnd: string;
}

export interface Settings {
  schoolName: string;
  weekdayLessons: Lesson[];
  fridayLessons: Lesson[];
  watchDuties: WatchDuties;
  showWatchDuties: boolean;
  examSettings: Partial<ExamConfig>;
  pin: string;
  logo?: string; // Base64 encoded image
}

export const DEFAULT_SETTINGS: Settings = {
  schoolName: "MAHMUT ESAT ORTAOKULU",
  pin: "1234",
  weekdayLessons: [
    { name: "1. Ders", start: "08:30", end: "09:10", breakAfter: "09:10-09:30", breakLabel: "1. teneffüs" },
    { name: "2. Ders", start: "09:30", end: "10:10", breakAfter: "10:10-10:25", breakLabel: "2. teneffüs" },
    { name: "3. Ders", start: "10:25", end: "11:05", breakAfter: "11:05-11:20", breakLabel: "3. teneffüs" },
    { name: "4. Ders", start: "11:20", end: "12:00", breakAfter: "12:00-12:15", breakLabel: "4. teneffüs" },
    { name: "5. Ders", start: "12:15", end: "12:55", breakAfter: "12:55-14:10", breakLabel: "öğle arası", isLunch: true },
    { name: "6. Ders", start: "14:10", end: "14:50", breakAfter: "14:50-15:05", breakLabel: "6. teneffüs" },
    { name: "7. Ders", start: "15:05", end: "15:45", breakAfter: null }
  ],
  fridayLessons: [
    { name: "1. Ders", start: "08:30", end: "09:10", breakAfter: "09:10-09:30", breakLabel: "1. teneffüs" },
    { name: "2. Ders", start: "09:30", end: "10:10", breakAfter: "10:10-10:20", breakLabel: "2. teneffüs" },
    { name: "3. Ders", start: "10:20", end: "11:00", breakAfter: "11:00-11:10", breakLabel: "3. teneffüs" },
    { name: "4. Ders", start: "11:10", end: "11:50", breakAfter: "11:50-12:00", breakLabel: "4. teneffüs" },
    { name: "5. Ders", start: "12:00", end: "12:40", breakAfter: "12:40-13:55", breakLabel: "öğle arası", isLunch: true },
    { name: "6. Ders", start: "13:55", end: "14:35", breakAfter: "14:35-14:50", breakLabel: "6. teneffüs" },
    { name: "7. Ders", start: "14:50", end: "15:30", breakAfter: null }
  ],
  watchDuties: {
    locations: ["Müdür Yrd.", "Bahçe", "Zemin", "1. Kat", "2. Kat", "3. Kat"],
    schedule: {
      monday: ["Mustafa Burak Kalkan", "Öğretmen 19", "Öğretmen 7", "Öğretmen 18", "Öğretmen 4", "Öğretmen 14"],
      tuesday: ["Öğretmen 4", "Öğretmen 19", "Öğretmen 1", "Öğretmen 1", "Öğretmen 11", "Öğretmen 16"],
      wednesday: ["Öğretmen 19", "Öğretmen 18", "Öğretmen 20", "Öğretmen 8", "Öğretmen 14", "Öğretmen 20"],
      thursday: ["Öğretmen 18", "Öğretmen 2", "Öğretmen 18", "Öğretmen 9", "Öğretmen 19", "Öğretmen 14"],
      friday: ["Öğretmen 7", "Öğretmen 10", "Öğretmen 1", "Öğretmen 13", "Öğretmen 19", "Öğretmen 7"],
      saturday: ["Öğretmen 4", "Öğretmen 8", "Öğretmen 5", "Öğretmen 13", "Öğretmen 7", "Öğretmen 10"],
      sunday: ["Öğretmen 16", "Öğretmen 15", "Öğretmen 11", "Öğretmen 14", "Öğretmen 6", "Öğretmen 8"]
    }
  },
  showWatchDuties: true,
  examSettings: {
    breakDuration: 15
  }
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dersProgramiSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge deeply or carefully? For now, we assume structure matches or we overwrite.
        // In a real app, we might want to merge missing fields from DEFAULT_SETTINGS
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('dersProgramiSettings', JSON.stringify(updated));
      return updated;
    });
  };

  return { settings, updateSettings, isLoaded };
}

