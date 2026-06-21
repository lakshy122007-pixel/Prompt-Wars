// Unified TypeScript types for EcoTrack frontend
// These mirror the Firestore data model defined in Part 5 of the spec

import { Timestamp } from 'firebase/firestore';
import { ActivityCategory } from '@ecotrack/shared';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  createdAt: Timestamp;
  unitsPreference: 'metric' | 'imperial';
  analyticsConsent: boolean;
  communityOptIn: boolean;
  communityHandle: string | null;
  weeklyDigestEnabled: boolean;
  emailVerified: boolean;
}

export interface Activity {
  id: string;
  userId: string;
  category: ActivityCategory;
  subtype: string;
  quantity: number;
  unit: string;
  co2eKg: number;
  loggedAt: Date;
  createdAt: Timestamp;
  notes: string | null;
}

export interface DailySummary {
  date: string; // YYYY-MM-DD
  totalCo2eKg: number;
  byCategory: {
    transport: number;
    energy: number;
    food: number;
    waste: number;
    water: number;
  };
  computedAt: Timestamp;
}

export interface WeeklySummary {
  week: string; // YYYY-Wxx
  totalCo2eKg: number;
  byCategory: {
    transport: number;
    energy: number;
    food: number;
    waste: number;
    water: number;
  };
  computedAt: Timestamp;
}

export interface MonthlySummary {
  month: string; // YYYY-MM
  totalCo2eKg: number;
  byCategory: {
    transport: number;
    energy: number;
    food: number;
    waste: number;
    water: number;
  };
  computedAt: Timestamp;
}

export interface Goal {
  id: string;
  category: string;
  type: 'percent_reduction' | 'absolute_target';
  targetValue: number;
  baselineValue: number;
  startDate: Timestamp;
  targetDate: Date;
  status: 'active' | 'achieved' | 'missed' | 'cancelled';
  createdAt: Timestamp;
}

export interface LeaderboardMember {
  uid: string;
  handle: string;
  percentileRank: number;
  lastUpdated: Timestamp;
}
