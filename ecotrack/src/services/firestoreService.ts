import {
  doc,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  updateDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from './firebaseConfig.js';

// Cloud Functions callers
const logActivityCallable = httpsCallable(functions, 'logActivity');
const createGoalCallable = httpsCallable(functions, 'createGoal');
const updateCommunityOptInCallable = httpsCallable(functions, 'updateCommunityOptIn');

export const firestoreService = {
  // --- USER PROFILE ---
  subscribeToProfile: (uid: string, callback: (profile: any) => void) => {
    const userRef = doc(db, 'users', uid);
    return onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data());
      }
    });
  },

  updateProfile: async (uid: string, data: any) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data);
  },

  // --- ACTIVITIES ---
  subscribeToRecentActivities: (uid: string, callback: (activities: any[]) => void, limitCount = 5) => {
    const activitiesRef = collection(db, 'users', uid, 'activities');
    const q = query(activitiesRef, orderBy('loggedAt', 'desc'), limit(limitCount));
    return onSnapshot(q, (snapshot) => {
      const activities: any[] = [];
      snapshot.forEach(doc => {
        const d = doc.data();
        // Convert Timestamp to Date
        d.loggedAt = d.loggedAt instanceof Timestamp ? d.loggedAt.toDate() : new Date(d.loggedAt);
        activities.push(d);
      });
      callback(activities);
    });
  },

  logActivity: async (activityData: any) => {
    // Call the Cloud Function
    const result = await logActivityCallable(activityData);
    return result.data;
  },

  deleteActivity: async (uid: string, activityId: string) => {
    // The Rules permit users to delete directly.
    const activityRef = doc(db, 'users', uid, 'activities', activityId);
    await deleteDoc(activityRef);
    // Note: Re-aggregating daily summary after deletion will happen on the next scheduler
    // or we can invoke/simulate updates. In standard run, rules allow direct write, but
    // deletion can be done here.
  },

  // --- SUMMARIES ---
  subscribeToDailySummaries: (uid: string, callback: (summaries: any[]) => void) => {
    const summariesRef = collection(db, 'users', uid, 'dailySummaries');
    const q = query(summariesRef, orderBy('date', 'desc'), limit(30));
    return onSnapshot(q, (snapshot) => {
      const summaries: any[] = [];
      snapshot.forEach(doc => {
        summaries.push(doc.data());
      });
      callback(summaries);
    });
  },

  subscribeToWeeklySummaries: (uid: string, callback: (summaries: any[]) => void) => {
    const summariesRef = collection(db, 'users', uid, 'weeklySummaries');
    const q = query(summariesRef, orderBy('week', 'desc'), limit(12));
    return onSnapshot(q, (snapshot) => {
      const summaries: any[] = [];
      snapshot.forEach(doc => {
        summaries.push(doc.data());
      });
      callback(summaries);
    });
  },

  subscribeToMonthlySummaries: (uid: string, callback: (summaries: any[]) => void) => {
    const summariesRef = collection(db, 'users', uid, 'monthlySummaries');
    const q = query(summariesRef, orderBy('month', 'desc'), limit(12));
    return onSnapshot(q, (snapshot) => {
      const summaries: any[] = [];
      snapshot.forEach(doc => {
        summaries.push(doc.data());
      });
      callback(summaries);
    });
  },

  // --- GOALS ---
  subscribeToGoals: (uid: string, callback: (goals: any[]) => void) => {
    const goalsRef = collection(db, 'users', uid, 'goals');
    const q = query(goalsRef, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const goals: any[] = [];
      snapshot.forEach(doc => {
        const d = doc.data();
        d.targetDate = d.targetDate instanceof Timestamp ? d.targetDate.toDate() : new Date(d.targetDate);
        goals.push(d);
      });
      callback(goals);
    });
  },

  createGoal: async (goalData: any) => {
    const result = await createGoalCallable(goalData);
    return result.data;
  },

  deleteGoal: async (uid: string, goalId: string) => {
    const goalRef = doc(db, 'users', uid, 'goals', goalId);
    await deleteDoc(goalRef);
  },

  updateGoalStatus: async (uid: string, goalId: string, status: string) => {
    const goalRef = doc(db, 'users', uid, 'goals', goalId);
    await updateDoc(goalRef, { status });
  },

  // --- LEADERBOARD & COMMUNITY ---
  subscribeToLeaderboard: (callback: (members: any[]) => void) => {
    const leaderboardRef = collection(db, 'community', 'leaderboard', 'members');
    const q = query(leaderboardRef, orderBy('percentileRank', 'asc'), limit(50));
    return onSnapshot(q, (snapshot) => {
      const members: any[] = [];
      snapshot.forEach(doc => {
        members.push({ uid: doc.id, ...doc.data() });
      });
      callback(members);
    });
  },

  updateCommunityOptIn: async (optInData: { optIn: boolean; handle?: string }) => {
    const result = await updateCommunityOptInCallable(optInData);
    return result.data;
  }
};
