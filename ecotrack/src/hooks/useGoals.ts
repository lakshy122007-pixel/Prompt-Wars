import { useEffect, useState } from 'react';
import { useAuth } from './useAuth.js';
import { firestoreService } from '../services/firestoreService.js';

export function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = firestoreService.subscribeToGoals(user.uid, (fetchedGoals) => {
      setGoals(fetchedGoals);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const createGoal = async (goalData: {
    category: string;
    type: 'percent_reduction' | 'absolute_target';
    targetValue: number;
    targetDate: string;
  }) => {
    return await firestoreService.createGoal(goalData);
  };

  const deleteGoal = async (goalId: string) => {
    if (user) {
      await firestoreService.deleteGoal(user.uid, goalId);
    }
  };

  const updateGoalStatus = async (goalId: string, status: string) => {
    if (user) {
      await firestoreService.updateGoalStatus(user.uid, goalId, status);
    }
  };

  return {
    goals,
    loading,
    createGoal,
    deleteGoal,
    updateGoalStatus
  };
}
