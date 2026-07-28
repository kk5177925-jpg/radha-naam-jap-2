import { useState } from 'react';
import { AppState, AudioMode, Language, Theme } from '../types';
import { getTranslation } from '../utils/translations';
import { Volume2, VolumeX, Smartphone, Palette, Globe, RotateCcw, AlertTriangle, ShieldCheck, Music } from 'lucide-react';

interface SettingsViewProps {
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
  onResetToday: () => void;
  onResetLifetime: () => void;
  lang: Language;
}

export default function SettingsView({ state, onUpdateState, onResetToday, onResetLifetime, lang }: SettingsViewProps) {
  const t = getTranslation(lang);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');

  const toggleSound = () => {
    onUpdateState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        soundEnabled: !prev.settings.soundEnabled,
      },
    }));
  };

  const toggleVibration = () => {
    onUpdateState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        vibrationEnabled: !prev.settings.vibrationEnabled,
      },
    }));
  };

  const setAudioMode = (mode: AudioMode) => {
    onUpdateState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        audioMode: mode,
      },
    }));
  };

  const setTheme = (theme: Theme) => {
    onUpdateState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        theme,
      },
    }));
  };

  const setLanguage = (newLang: Language) => {
    onUpdateState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        language: newLang,
      },
    }));
  };

  const handleConfirmLifetimeReset = () => {
    onResetLifetime();
    setShowResetModal(false);
    setResetSuccessMsg(t.settings.resetSuccess);
    setTimeout(() => setResetSuccessMsg(''), 3000);
  };

  return (
    <div className="flex flex-col gap-5 px-4 py-4 max-w-lg mx-auto text-amber-100 pb-28">
      {/* Title */}
      <div className="flex items-center gap-2 text-xl font-devanagari font-bold text-amber-200 border-b border-amber-500/20 pb-3">
        <span>{t.settings.title}</span>
      </div>

      {resetSuccessMsg && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs font-poppins flex items-center gap-2 animate-bounce">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>{resetSuccessMsg}</span>
        </div>
      )}

      {/* Language Selection */}
      <div className="bg-gradient-to-b from-amber-950/90 to-amber-900/80 border border-amber-500/30 p-4 rounded-2xl shadow-md">
        <div className="flex items-center gap-2 text-sm font-poppins font-semibold text-amber-200 mb-3">
          <Globe className="w-4 h-4 text-amber-400" />
          <span>{t.settings.language}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setLanguage('hi')}
            className={`p-3 rounded-xl border text-sm font-devanagari font-bold transition-all cursor-pointer ${
              state.settings.language === 'hi'
                ? 'bg-amber-500 text-amber-950 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                : 'bg-amber-950/60 text-amber-200 border-amber-700/50 hover:bg-amber-900/50'
            }`}
          >
            हिंदी (Hindi)
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`p-3 rounded-xl border text-sm font-poppins font-semibold transition-all cursor-pointer ${
              state.settings.language === 'en'
                ? 'bg-amber-500 text-amber-950 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                : 'bg-amber-950/60 text-amber-200 border-amber-700/50 hover:bg-amber-900/50'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Sound Settings */}
      <div className="bg-gradient-to-b from-amber-950/90 to-amber-900/80 border border-amber-500/30 p-4 rounded-2xl shadow-md flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {state.settings.soundEnabled ? (
              <Volume2 className="w-5 h-5 text-amber-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-amber-500/60" />
            )}
            <div>
              <div className="font-poppins font-semibold text-sm text-amber-200">{t.settings.sound}</div>
              <div className="text-[11px] text-amber-300/70 font-poppins">{t.settings.soundDesc}</div>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={state.settings.soundEnabled}
              onChange={toggleSound}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-amber-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-amber-100 after:border-amber-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500 border border-amber-600/50"></div>
          </label>
        </div>

        {state.settings.soundEnabled && (
          <div className="border-t border-amber-600/20 pt-3 flex flex-col gap-2">
            <div className="text-xs font-poppins text-amber-300 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.settings.audioMode}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-poppins">
              <button
                onClick={() => setAudioMode('sweet')}
                className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                  state.settings.audioMode === 'sweet'
                    ? 'bg-amber-500 text-amber-950 border-amber-200 font-bold'
                    : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                }`}
              >
                {t.settings.audioModes.sweet}
              </button>
              <button
                onClick={() => setAudioMode('bell')}
                className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                  state.settings.audioMode === 'bell'
                    ? 'bg-amber-500 text-amber-950 border-amber-200 font-bold'
                    : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                }`}
              >
                {t.settings.audioModes.bell}
              </button>
              <button
                onClick={() => setAudioMode('both')}
                className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                  state.settings.audioMode === 'both'
                    ? 'bg-amber-500 text-amber-950 border-amber-200 font-bold'
                    : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                }`}
              >
                {t.settings.audioModes.both}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Vibration Settings */}
      <div className="bg-gradient-to-b from-amber-950/90 to-amber-900/80 border border-amber-500/30 p-4 rounded-2xl shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Smartphone className="w-5 h-5 text-amber-400" />
          <div>
            <div className="font-poppins font-semibold text-sm text-amber-200">{t.settings.vibration}</div>
            <div className="text-[11px] text-amber-300/70 font-poppins">{t.settings.vibrationDesc}</div>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={state.settings.vibrationEnabled}
            onChange={toggleVibration}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-amber-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-amber-100 after:border-amber-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500 border border-amber-600/50"></div>
        </label>
      </div>

      {/* Theme Options */}
      <div className="bg-gradient-to-b from-amber-950/90 to-amber-900/80 border border-amber-500/30 p-4 rounded-2xl shadow-md">
        <div className="flex items-center gap-2 text-sm font-poppins font-semibold text-amber-200 mb-3">
          <Palette className="w-4 h-4 text-amber-400" />
          <span>{t.settings.theme}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs font-poppins">
          <button
            onClick={() => setTheme('saffron')}
            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
              state.settings.theme === 'saffron'
                ? 'bg-amber-500 text-amber-950 border-amber-200 font-bold shadow-md'
                : 'bg-amber-950/60 text-amber-300 border-amber-800'
            }`}
          >
            {t.settings.themes.saffron}
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
              state.settings.theme === 'dark'
                ? 'bg-amber-500 text-amber-950 border-amber-200 font-bold shadow-md'
                : 'bg-amber-950/60 text-amber-300 border-amber-800'
            }`}
          >
            {t.settings.themes.dark}
          </button>
          <button
            onClick={() => setTheme('light')}
            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
              state.settings.theme === 'light'
                ? 'bg-amber-500 text-amber-950 border-amber-200 font-bold shadow-md'
                : 'bg-amber-950/60 text-amber-300 border-amber-800'
            }`}
          >
            {t.settings.themes.light}
          </button>
        </div>
      </div>

      {/* Reset Counters */}
      <div className="bg-gradient-to-b from-amber-950/90 to-amber-900/80 border border-amber-500/30 p-4 rounded-2xl shadow-md flex flex-col gap-3">
        <button
          onClick={onResetToday}
          className="w-full py-2.5 px-4 bg-amber-900/80 hover:bg-amber-800/80 border border-amber-600/40 text-amber-200 font-poppins text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span>{t.settings.resetToday}</span>
        </button>

        <button
          onClick={() => setShowResetModal(true)}
          className="w-full py-2.5 px-4 bg-rose-950/80 hover:bg-rose-900/80 border border-rose-700/50 text-rose-200 font-poppins text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>{t.settings.resetLifetime}</span>
        </button>
      </div>

      {/* Android Native App Downloads */}
      <div className="bg-gradient-to-b from-amber-950/90 to-amber-900/80 border border-amber-500/40 p-4 rounded-2xl shadow-lg flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <Smartphone className="w-5 h-5 text-amber-400 animate-pulse" />
          <div>
            <div className="font-poppins font-bold text-sm text-amber-200">Android App Projects (Ready for Studio)</div>
            <div className="text-[11px] text-amber-300/80 font-poppins">
              Download complete, ready-to-compile Android Studio projects for APK / AAB generation:
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 pt-2 border-t border-amber-600/30">
          <a
            href="/downloads/RadhaJaap_Android_Kotlin_Source.zip"
            download
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-amber-950 font-poppins text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-amber-950" />
            <span>Download Native Kotlin (Jetpack Compose) Project (.zip)</span>
          </a>

          <a
            href="/downloads/RadhaJaap_Capacitor_Android_New_Project.zip"
            download
            className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-amber-950 font-poppins text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-amber-950" />
            <span>Download New Android Capacitor Project (.zip)</span>
          </a>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-amber-900 to-amber-950 border border-amber-500/40 p-6 rounded-3xl max-w-sm w-full text-center shadow-2xl flex flex-col items-center">
            <AlertTriangle className="w-12 h-12 text-rose-400 mb-3 animate-pulse" />
            <h3 className="font-devanagari text-xl font-bold text-amber-100 mb-2">
              {t.settings.resetConfirmTitle}
            </h3>
            <p className="text-xs font-poppins text-amber-300/80 mb-6 leading-relaxed">
              {t.settings.resetConfirmDesc}
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-2.5 bg-amber-900 border border-amber-600/40 text-amber-200 rounded-xl font-poppins text-xs font-medium cursor-pointer"
              >
                {t.settings.cancel}
              </button>
              <button
                onClick={handleConfirmLifetimeReset}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-poppins text-xs font-bold cursor-pointer shadow-lg"
              >
                {t.settings.confirmReset}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
