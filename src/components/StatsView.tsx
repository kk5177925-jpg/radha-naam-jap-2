import { AppState, Language, MILESTONES } from '../types';
import { getTranslation } from '../utils/translations';
import { Award, Calendar, Flame, TrendingUp, Trophy, CheckCircle2 } from 'lucide-react';

interface StatsViewProps {
  state: AppState;
  lang: Language;
}

export default function StatsView({ state, lang }: StatsViewProps) {
  const t = getTranslation(lang);

  // Calculate Last 7 Days counts
  const last7DaysData: { dateLabel: string; count: number }[] = [];
  let weeklyTotal = 0;
  let monthlyTotal = 0;

  const today = new Date();
  
  // Last 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayName = d.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'short' });
    
    let cnt = 0;
    if (i === 0) {
      cnt = state.todayCount;
    } else {
      cnt = state.history[dateStr] || 0;
    }

    weeklyTotal += cnt;
    last7DaysData.push({
      dateLabel: dayName,
      count: cnt,
    });
  }

  // Monthly total (last 30 days)
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const cnt = i === 0 ? state.todayCount : (state.history[dateStr] || 0);
    monthlyTotal += cnt;
  }

  // Max value in last 7 days for bar chart scale
  const maxWeeklyCount = Math.max(...last7DaysData.map(d => d.count), 1);

  return (
    <div className="flex flex-col gap-5 px-4 py-4 max-w-lg mx-auto text-amber-100 pb-24">
      {/* Page Title */}
      <div className="flex items-center gap-2 text-xl font-devanagari font-bold text-amber-200 border-b border-amber-500/20 pb-3">
        <TrendingUp className="w-6 h-6 text-amber-400" />
        <span>{t.stats.title}</span>
      </div>

      {/* Grid Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Today's Count */}
        <div className="bg-gradient-to-br from-amber-900/80 to-amber-950/90 border border-amber-500/30 p-3.5 rounded-2xl shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-poppins text-amber-300">
            <span>{t.stats.today}</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 font-devanagari text-3xl font-bold text-amber-200">
            {state.todayCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-400/80 font-poppins mt-1">
            {Math.floor(state.todayCount / 108)} {t.malaCount}
          </div>
        </div>

        {/* Lifetime Count */}
        <div className="bg-gradient-to-br from-amber-900/80 to-amber-950/90 border border-amber-500/30 p-3.5 rounded-2xl shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-poppins text-amber-300">
            <span>{t.stats.lifetime}</span>
            <Trophy className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="mt-2 font-devanagari text-3xl font-bold text-yellow-300">
            {state.lifetimeCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-yellow-400/80 font-poppins mt-1">
            {Math.floor(state.lifetimeCount / 108)} {t.malaCount}
          </div>
        </div>

        {/* Streak */}
        <div className="bg-gradient-to-br from-amber-900/80 to-amber-950/90 border border-amber-500/30 p-3.5 rounded-2xl shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-poppins text-amber-300">
            <span>{t.stats.currentStreak}</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-2 font-devanagari text-3xl font-bold text-orange-300">
            {state.streak} <span className="text-sm font-poppins font-normal text-amber-200">{t.streakDays}</span>
          </div>
        </div>

        {/* Best Day Record */}
        <div className="bg-gradient-to-br from-amber-900/80 to-amber-950/90 border border-amber-500/30 p-3.5 rounded-2xl shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-poppins text-amber-300">
            <span>{t.stats.bestDayRecord}</span>
            <Award className="w-4 h-4 text-amber-300" />
          </div>
          <div className="mt-2 font-devanagari text-3xl font-bold text-amber-200">
            {Math.max(state.bestDay?.count || 0, state.todayCount).toLocaleString()}
          </div>
          <div className="text-[10px] text-amber-400/70 font-poppins truncate mt-1">
            {state.bestDay?.date || '—'}
          </div>
        </div>
      </div>

      {/* Weekly Activity Bar Chart */}
      <div className="bg-gradient-to-b from-amber-950/90 to-amber-900/80 border border-amber-500/30 p-4 rounded-2xl shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-poppins font-semibold text-sm text-amber-200 flex items-center gap-2">
            <span>{t.stats.weeklyOverview}</span>
          </h3>
          <span className="text-xs font-poppins text-amber-400 font-bold">
            {t.stats.thisWeek}: {weeklyTotal.toLocaleString()}
          </span>
        </div>

        {/* Bars */}
        <div className="flex items-end justify-between gap-2 h-36 pt-4 px-1 border-b border-amber-600/30 pb-2">
          {last7DaysData.map((d, i) => {
            const heightPercent = Math.max((d.count / maxWeeklyCount) * 100, 6);
            const isToday = i === 6;

            return (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] font-poppins text-amber-300 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.count}
                </span>
                <div
                  className={`w-full max-w-[28px] rounded-t-lg transition-all duration-500 ${
                    isToday
                      ? 'bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-300 shadow-[0_0_12px_rgba(251,191,36,0.8)]'
                      : 'bg-gradient-to-t from-amber-900 to-amber-600 opacity-70 group-hover:opacity-100'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
                <span className={`text-[11px] font-poppins mt-2 ${isToday ? 'text-amber-300 font-bold' : 'text-amber-400/70'}`}>
                  {d.dateLabel}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex justify-between text-xs text-amber-300/80 font-poppins">
          <span>{t.stats.thisMonth}: <strong>{monthlyTotal.toLocaleString()}</strong></span>
        </div>
      </div>

      {/* Milestone Progress List */}
      <div className="bg-gradient-to-b from-amber-950/90 to-amber-900/80 border border-amber-500/30 p-4 rounded-2xl shadow-md">
        <h3 className="font-poppins font-semibold text-sm text-amber-200 mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>{t.stats.milestoneProgress}</span>
        </h3>

        <div className="flex flex-col gap-3">
          {MILESTONES.map(m => {
            const isUnlocked = state.lifetimeCount >= m;
            const progress = Math.min(Math.round((state.lifetimeCount / m) * 100), 100);

            return (
              <div key={m} className="bg-amber-950/60 p-2.5 rounded-xl border border-amber-500/20 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-poppins">
                  <span className="flex items-center gap-1.5 font-semibold text-amber-200">
                    {isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-amber-500/40" />
                    )}
                    {m.toLocaleString()} {t.radha}
                  </span>
                  <span className={`text-[11px] ${isUnlocked ? 'text-emerald-400 font-bold' : 'text-amber-400/80'}`}>
                    {isUnlocked ? t.stats.completed : `${progress}%`}
                  </span>
                </div>

                <div className="w-full bg-amber-950 h-2 rounded-full border border-amber-800/40 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isUnlocked
                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                        : 'bg-amber-500/80'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
