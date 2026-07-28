import { useState, useEffect, useCallback, useRef, MouseEvent, TouchEvent } from 'react';
import { AppState, FloatingText } from './types';
import { loadAppState, saveAppState, checkNewMilestone, getTodayDateString } from './utils/storage';
import { playTapAudio, vibrateTap } from './utils/audioEngine';
import { getTranslation } from './utils/translations';

// Components
import FloatingParticles from './components/FloatingParticles';
import PetalCanvas from './components/PetalCanvas';
import FloatingPlusOne from './components/FloatingPlusOne';
import JapButton from './components/JapButton';
import MalaView from './components/MalaView';
import StatsView from './components/StatsView';
import SettingsView from './components/SettingsView';
import MilestoneModal from './components/MilestoneModal';
import NavigationBar, { TabType } from './components/NavigationBar';

import devotionalBg from './assets/images/devotional_background_1784722074258.jpg';
import { Sparkles, Trophy, Calendar, Music, VolumeX } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<TabType>('jap');
  const [floatingItems, setFloatingItems] = useState<FloatingText[]>([]);
  const [activeMilestone, setActiveMilestone] = useState<number | null>(null);
  const [showPetals, setShowPetals] = useState(false);
  const lastTapTimeRef = useRef<number>(0);

  const t = getTranslation(state.settings.language);

  // Sync state to local storage on changes
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // Midnight check interval every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const today = getTodayDateString();
      if (state.lastActiveDate !== today) {
        setState(prev => loadAppState());
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [state.lastActiveDate]);

  // Main Tap Handler
  const handleTap = useCallback((e?: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>) => {
    // Prevent double-counting / duplicate taps within 120ms
    const now = Date.now();
    if (now - lastTapTimeRef.current < 120) {
      return;
    }
    lastTapTimeRef.current = now;

    // 1. Get tap coordinates for floating particle
    let clientX = window.innerWidth / 2;
    let clientY = window.innerHeight / 2 - 20;

    if (e) {
      if ('touches' in e && e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }
    }

    // 2. Add floating text particle (+1 or "राधा")
    const newFloatingId = Date.now() + Math.random();
    const particleText = Math.random() > 0.4 ? '+1' : 'राधा';
    setFloatingItems(prev => [
      ...prev.slice(-12),
      { id: newFloatingId, x: clientX, y: clientY, text: particleText },
    ]);

    setTimeout(() => {
      setFloatingItems(prev => prev.filter(item => item.id !== newFloatingId));
    }, 900);

    // 3. Audio & Haptics
    playTapAudio(state.settings.soundEnabled, state.settings.audioMode);
    vibrateTap(state.settings.vibrationEnabled);

    // 4. Update Counts
    setState(prev => {
      const newTodayCount = prev.todayCount + 1;
      const newLifetimeCount = prev.lifetimeCount + 1;

      // Check Milestone
      const newM = checkNewMilestone(newLifetimeCount, prev.unlockedMilestones);
      if (newM) {
        setActiveMilestone(newM);
        setShowPetals(true);
      }

      const updatedUnlocked = newM
        ? [...prev.unlockedMilestones, newM]
        : prev.unlockedMilestones;

      return {
        ...prev,
        todayCount: newTodayCount,
        lifetimeCount: newLifetimeCount,
        unlockedMilestones: updatedUnlocked,
      };
    });
  }, [state.settings]);

  // Reset Today's Count
  const handleResetToday = () => {
    setState(prev => ({
      ...prev,
      todayCount: 0,
    }));
  };

  // Reset Lifetime Count
  const handleResetLifetime = () => {
    setState(prev => ({
      ...prev,
      todayCount: 0,
      lifetimeCount: 0,
      history: {},
      streak: 0,
      unlockedMilestones: [],
      bestDay: {
        date: getTodayDateString(),
        count: 0,
      },
    }));
  };

  // Theme styling based on state.settings.theme
  const themeBgClass =
    state.settings.theme === 'light'
      ? 'bg-gradient-to-b from-amber-100 via-amber-50 to-amber-100 text-amber-950'
      : state.settings.theme === 'dark'
      ? 'bg-gradient-to-b from-slate-950 via-zinc-950 to-slate-950 text-amber-100'
      : 'bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 text-amber-100';

  return (
    <div className={`relative min-h-screen w-full overflow-x-hidden ${themeBgClass} flex flex-col font-poppins select-none`}>
      
      {/* Devotional Background Image Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-25 mix-blend-overlay">
        <img
          src={devotionalBg}
          alt="Devotional Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Floating Sparkles & Ambient Particles */}
      <FloatingParticles />

      {/* Flower Petals Shower Canvas on Milestone */}
      <PetalCanvas active={showPetals} onComplete={() => setShowPetals(false)} />

      {/* Floating "+1" / "राधा" Tap Effects */}
      <FloatingPlusOne floatingItems={floatingItems} />

      {/* App Top Header Bar */}
      <header className="relative z-10 pt-4 px-4 pb-2 flex items-center justify-between max-w-lg mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-[0_0_15px_rgba(245,158,11,0.6)] flex items-center justify-center">
            <span className="font-devanagari text-lg text-amber-950 font-bold">𑁍</span>
          </div>
          <div>
            <h1 className="font-devanagari text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100">
              {t.appName}
            </h1>
            <p className="font-kalam text-[11px] text-amber-300/80 -mt-1">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Quick Sound Mute Toggle Button */}
        <button
          onClick={() =>
            setState(prev => ({
              ...prev,
              settings: { ...prev.settings, soundEnabled: !prev.settings.soundEnabled },
            }))
          }
          className="p-2 rounded-full bg-amber-950/70 border border-amber-500/30 text-amber-300 hover:bg-amber-900/80 cursor-pointer transition-all"
          title={state.settings.soundEnabled ? 'Mute' : 'Unmute'}
        >
          {state.settings.soundEnabled ? (
            <Music className="w-4 h-4 text-amber-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-amber-500/60" />
          )}
        </button>
      </header>

      {/* Main Content Area Based on Active Tab */}
      <main className="relative z-10 flex-1 flex flex-col justify-between max-w-lg mx-auto w-full pb-20">
        {activeTab === 'jap' && (
          <div className="flex flex-col items-center justify-between flex-1 py-2 px-4">
            
            {/* Counter Summary Cards */}
            <div className="grid grid-cols-2 gap-3 w-full my-2">
              {/* Today Count Card */}
              <div className="bg-gradient-to-br from-amber-950/90 via-amber-900/80 to-amber-950/90 border border-amber-500/40 p-3 rounded-2xl shadow-lg flex flex-col items-center text-center backdrop-blur-md">
                <span className="text-xs font-poppins text-amber-300 flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  {t.todayCount}
                </span>
                <span className="font-devanagari text-3xl sm:text-4xl font-extrabold text-amber-100 mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {state.todayCount.toLocaleString()}
                </span>
                <span className="text-[10px] font-kalam text-amber-300/80 mt-0.5">
                  ({Math.floor(state.todayCount / 108)} {t.malaCount})
                </span>
              </div>

              {/* Lifetime Count Card */}
              <div className="bg-gradient-to-br from-amber-950/90 via-amber-900/80 to-amber-950/90 border border-amber-500/40 p-3 rounded-2xl shadow-lg flex flex-col items-center text-center backdrop-blur-md">
                <span className="text-xs font-poppins text-amber-300 flex items-center gap-1 font-medium">
                  <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                  {t.lifetimeCount}
                </span>
                <span className="font-devanagari text-3xl sm:text-4xl font-extrabold text-yellow-300 mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {state.lifetimeCount.toLocaleString()}
                </span>
                <span className="text-[10px] font-kalam text-amber-300/80 mt-0.5">
                  ({Math.floor(state.lifetimeCount / 108)} {t.malaCount})
                </span>
              </div>
            </div>

            {/* Exact Center Glowing "राधा" Jap Button */}
            <div className="my-auto flex items-center justify-center py-4">
              <JapButton onTap={handleTap} lang={state.settings.language} />
            </div>

            {/* Bottom Devotional Mantra Quote */}
            <div className="text-center py-2 px-4 bg-amber-950/60 rounded-full border border-amber-500/30 text-xs sm:text-sm font-kalam text-amber-200 shadow-md backdrop-blur-md mb-2">
              {t.footer}
            </div>
          </div>
        )}

        {activeTab === 'mala' && (
          <MalaView
            todayCount={state.todayCount}
            lifetimeCount={state.lifetimeCount}
            onTap={handleTap}
            lang={state.settings.language}
          />
        )}

        {activeTab === 'stats' && (
          <StatsView state={state} lang={state.settings.language} />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            state={state}
            onUpdateState={setState}
            onResetToday={handleResetToday}
            onResetLifetime={handleResetLifetime}
            lang={state.settings.language}
          />
        )}
      </main>

      {/* Milestone Celebration Modal */}
      <MilestoneModal
        milestone={activeMilestone}
        onClose={() => setActiveMilestone(null)}
        lang={state.settings.language}
        soundEnabled={state.settings.soundEnabled}
        vibrationEnabled={state.settings.vibrationEnabled}
      />

      {/* Material 3 Bottom Navigation Bar */}
      <NavigationBar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        lang={state.settings.language}
      />
    </div>
  );
}
