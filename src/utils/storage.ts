import { AppState, MILESTONES } from '../types';

const STORAGE_KEY = 'radha_naam_jap_state_v1';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const initialAppState: AppState = {
  todayCount: 0,
  lifetimeCount: 0,
  lastActiveDate: getTodayDateString(),
  history: {},
  bestDay: {
    date: getTodayDateString(),
    count: 0,
  },
  streak: 0,
  unlockedMilestones: [],
  settings: {
    soundEnabled: true,
    vibrationEnabled: true,
    audioMode: 'sweet',
    theme: 'saffron',
    language: 'hi',
  },
};

/**
 * Load app state from LocalStorage and perform midnight check
 */
export function loadAppState(): AppState {
  if (typeof window === 'undefined') return initialAppState;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const state = { ...initialAppState, lastActiveDate: getTodayDateString() };
      saveAppState(state);
      return state;
    }

    const parsed = JSON.parse(raw) || {};
    const today = getTodayDateString();

    // Safely default all properties before accessing
    if (!parsed.history || typeof parsed.history !== 'object') parsed.history = {};
    if (!parsed.unlockedMilestones || !Array.isArray(parsed.unlockedMilestones)) parsed.unlockedMilestones = [];
    if (!parsed.bestDay || typeof parsed.bestDay !== 'object') {
      parsed.bestDay = { date: today, count: 0 };
    }
    if (typeof parsed.todayCount !== 'number' || isNaN(parsed.todayCount)) parsed.todayCount = 0;
    if (typeof parsed.lifetimeCount !== 'number' || isNaN(parsed.lifetimeCount)) parsed.lifetimeCount = 0;
    if (typeof parsed.streak !== 'number' || isNaN(parsed.streak)) parsed.streak = 0;
    if (!parsed.lastActiveDate) parsed.lastActiveDate = today;

    // Check if the date has changed (midnight reset check)
    if (parsed.lastActiveDate !== today) {
      // Archive previous todayCount into history if > 0
      if (parsed.todayCount > 0) {
        parsed.history[parsed.lastActiveDate] = (parsed.history[parsed.lastActiveDate] || 0) + parsed.todayCount;
      }

      // Check Best Day Record
      if (parsed.todayCount > (parsed.bestDay?.count || 0)) {
        parsed.bestDay = {
          date: parsed.lastActiveDate,
          count: parsed.todayCount,
        };
      }

      // Calculate Streak
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayStr = `${yesterdayDate.getFullYear()}-${String(yesterdayDate.getMonth() + 1).padStart(2, '0')}-${String(yesterdayDate.getDate()).padStart(2, '0')}`;

      if (parsed.lastActiveDate === yesterdayStr && parsed.todayCount > 0) {
        parsed.streak = (parsed.streak || 0) + 1;
      } else if (parsed.lastActiveDate !== yesterdayStr) {
        parsed.streak = parsed.todayCount > 0 ? 1 : 0;
      }

      // Reset Today's Count automatically every midnight
      parsed.todayCount = 0;
      parsed.lastActiveDate = today;

      saveAppState(parsed);
    }

    // Ensure settings defaults are present
    parsed.settings = {
      ...initialAppState.settings,
      ...(parsed.settings || {}),
    };

    return parsed as AppState;
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    return initialAppState;
  }
}

/**
 * Save app state to LocalStorage
 */
export function saveAppState(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

/**
 * Check if a new milestone was reached after incrementing count
 */
export function checkNewMilestone(currentLifetimeCount: number, previouslyUnlocked: number[]): number | null {
  for (const m of MILESTONES) {
    if (currentLifetimeCount >= m && !previouslyUnlocked.includes(m)) {
      return m;
    }
  }
  return null;
}
