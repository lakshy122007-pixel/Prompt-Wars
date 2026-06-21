import { useEffect, useState } from 'react';
import { useAuth } from './useAuth.js';
import { firestoreService } from '../services/firestoreService.js';

export function useActivities(limitCount = 10) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = firestoreService.subscribeToRecentActivities(
      user.uid,
      (fetchedActivities) => {
        setActivities(fetchedActivities);
        setLoading(false);
      },
      limitCount
    );

    return () => unsubscribe();
  }, [user, limitCount]);

  const logActivity = async (activityData: {
    category: 'transport' | 'energy' | 'food' | 'waste' | 'water';
    subtype: string;
    quantity: number;
    loggedAt: string;
    notes?: string;
  }) => {
    return await firestoreService.logActivity(activityData);
  };

  const deleteActivity = async (activityId: string) => {
    if (user) {
      await firestoreService.deleteActivity(user.uid, activityId);
    }
  };

  return {
    activities,
    loading,
    logActivity,
    deleteActivity
  };
}
