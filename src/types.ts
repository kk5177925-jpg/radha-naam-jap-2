export type Language = 'hi' | 'en';
export type Theme = 'dark' | 'light' | 'saffron';
export type AudioMode = 'sweet' | 'bell' | 'both';

export interface Settings {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  audioMode: AudioMode;
  theme: Theme;
  language: Language;
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface AppState {
  todayCount: number;
  lifetimeCount: number;
  lastActiveDate: string; // YYYY-MM-DD
  history: Record<string, number>; // date string -> count
  bestDay: {
    date: string;
    count: number;
  };
  streak: number;
  unlockedMilestones: number[];
  settings: Settings;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
}

export const MILESTONES = [108, 1008, 5008, 10008, 50008, 100008];
