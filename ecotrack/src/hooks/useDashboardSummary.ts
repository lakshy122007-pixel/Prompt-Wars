import { useEffect, useState } from 'react';
import { useAuth } from './useAuth.js';
import { firestoreService } from '../services/firestoreService.js';
import { getDateISOString } from '@ecotrack/shared';

export interface DashboardSummary {
  todayCo2e: number;
  thisWeekCo2e: number;
  lastWeekCo2e: number;
  trendPercentage: number;
  streakDays: number;
  dailyChartData: [string, number][];
  loading: boolean;
  empty: boolean;
}

export function useDashboardSummary() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary>({
    todayCo2e: 0,
    thisWeekCo2e: 0,
    lastWeekCo2e: 0,
    trendPercentage: 0,
    streakDays: 0,
    dailyChartData: [],
    loading: true,
    empty: true
  });

  useEffect(() => {
    if (!user) return;

    const unsubscribe = firestoreService.subscribeToDailySummaries(user.uid, (summaries) => {
      if (summaries.length === 0) {
        setSummary({
          todayCo2e: 0,
          thisWeekCo2e: 0,
          lastWeekCo2e: 0,
          trendPercentage: 0,
          streakDays: 0,
          dailyChartData: [],
          loading: false,
          empty: true
        });
        return;
      }

      const todayStr = getDateISOString(new Date());

      // 1. Calculate Today's CO2e
      const todaySummary = summaries.find(s => s.date === todayStr);
      const todayCo2e = todaySummary ? todaySummary.totalCo2eKg : 0;

      // 2. Calculate This Week's vs Last Week's CO2e
      const now = new Date();
      const thisWeekDates: string[] = [];
      const lastWeekDates: string[] = [];

      for (let i = 0; i < 7; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        thisWeekDates.push(getDateISOString(d));
      }

      for (let i = 7; i < 14; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        lastWeekDates.push(getDateISOString(d));
      }

      let thisWeekCo2e = 0;
      let lastWeekCo2e = 0;

      summaries.forEach(s => {
        if (thisWeekDates.includes(s.date)) {
          thisWeekCo2e += s.totalCo2eKg || 0;
        }
        if (lastWeekDates.includes(s.date)) {
          lastWeekCo2e += s.totalCo2eKg || 0;
        }
      });

      // 3. Trend percentage calculation
      let trendPercentage = 0;
      if (lastWeekCo2e > 0) {
        trendPercentage = ((thisWeekCo2e - lastWeekCo2e) / lastWeekCo2e) * 100;
      } else if (thisWeekCo2e > 0) {
        trendPercentage = 100; // 100% increase from zero
      }

      // 4. Calculate Consecutive Logging Streak
      // Sort summaries by date desc
      const sortedSummaries = [...summaries].sort((a, b) => b.date.localeCompare(a.date));
      let streakDays = 0;
      let checkDate = new Date(); // Start checking from today

      // If they didn't log today, see if they logged yesterday to keep streak alive
      const yesterdayStr = getDateISOString(new Date(Date.now() - 86400000));
      const hasToday = sortedSummaries.some(s => s.date === todayStr && s.totalCo2eKg > 0);
      const hasYesterday = sortedSummaries.some(s => s.date === yesterdayStr && s.totalCo2eKg > 0);

      if (hasToday || hasYesterday) {
        if (!hasToday && hasYesterday) {
          // If no logs today but logged yesterday, start streak check from yesterday
          checkDate.setDate(checkDate.getDate() - 1);
        }

        while (true) {
          const dateStr = getDateISOString(checkDate);
          const dayData = sortedSummaries.find(s => s.date === dateStr);
          
          if (dayData && dayData.totalCo2eKg > 0) {
            streakDays++;
            checkDate.setDate(checkDate.getDate() - 1); // Go back one day
          } else {
            break; // Streak broken
          }
        }
      }

      // 5. Format Chart Data for Last 7 Days (for Google Charts line chart)
      // Needs format: [['Day', 'CO2e (kg)'], ['Mon', 12.5], ...]
      const chartDays = [...thisWeekDates].reverse();
      const dailyChartData: [string, number][] = chartDays.map(dateStr => {
        const daySummary = summaries.find(s => s.date === dateStr);
        // Format YYYY-MM-DD to short weekday/date (e.g. "Jun 21")
        const label = new Date(`${dateStr}T00:00:00.000Z`).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          timeZone: 'UTC'
        });
        return [label, daySummary ? Number(daySummary.totalCo2eKg.toFixed(1)) : 0];
      });

      setSummary({
        todayCo2e: Number(todayCo2e.toFixed(2)),
        thisWeekCo2e: Number(thisWeekCo2e.toFixed(2)),
        lastWeekCo2e: Number(lastWeekCo2e.toFixed(2)),
        trendPercentage: Number(trendPercentage.toFixed(0)),
        streakDays,
        dailyChartData,
        loading: false,
        empty: false
      });
    });

    return () => unsubscribe();
  }, [user]);

  return summary;
}
