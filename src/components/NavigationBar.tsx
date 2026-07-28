import { ReactNode } from 'react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';
import { Flame, CircleDot, BarChart3, Settings } from 'lucide-react';

export type TabType = 'jap' | 'mala' | 'stats' | 'settings';

interface NavigationBarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  lang: Language;
}

export default function NavigationBar({ activeTab, onChangeTab, lang }: NavigationBarProps) {
  const t = getTranslation(lang);

  const tabs: { id: TabType; label: string; icon: ReactNode }[] = [
    {
      id: 'jap',
      label: t.tabs.jap,
      icon: <Flame className="w-5 h-5" />,
    },
    {
      id: 'mala',
      label: t.tabs.mala,
      icon: <CircleDot className="w-5 h-5" />,
    },
    {
      id: 'stats',
      label: t.tabs.stats,
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: t.tabs.settings,
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-amber-950 via-amber-950/95 to-amber-950/80 backdrop-blur-lg border-t border-amber-500/30 px-3 py-2 max-w-lg mx-auto shadow-[0_-4px_25px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-around">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-2 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-amber-200 font-bold'
                  : 'text-amber-400/60 hover:text-amber-300'
              }`}
            >
              <div
                className={`p-1.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-amber-500 text-amber-950 shadow-[0_0_15px_rgba(245,158,11,0.8)] scale-110'
                    : ''
                }`}
              >
                {tab.icon}
              </div>
              <span className="text-[11px] font-poppins mt-1 tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
