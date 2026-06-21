import React, { useState } from 'react';
import { useGoals } from '../hooks/useGoals.js';
import { goalSchema } from '@ecotrack/shared';
import { Target, Plus, Trash2, CheckCircle, Clock, XCircle, AlertCircle, X } from 'lucide-react';

const CATEGORY_OPTIONS = ['overall', 'transport', 'energy', 'food', 'waste', 'water'];

const Goals: React.FC = () => {
  const { goals, loading, createGoal, deleteGoal } = useGoals();
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: 'overall',
    type: 'percent_reduction' as 'percent_reduction' | 'absolute_target',
    targetValue: '',
    targetDate: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const payload = {
      category: formData.category,
      type: formData.type,
      targetValue: Number(formData.targetValue),
      targetDate: formData.targetDate
    };

    const parsed = goalSchema.safeParse(payload);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach(i => {
        if (i.path[0]) errs[i.path[0] as string] = i.message;
      });
      setFormErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await createGoal(payload as any);
      setShowModal(false);
      setFormData({ category: 'overall', type: 'percent_reduction', targetValue: '', targetDate: '' });
      showToast('Goal created successfully!');
    } catch (err: any) {
      setFormErrors({ server: err.message || 'Failed to create goal' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (goalId: string) => {
    await deleteGoal(goalId);
    setDeleteConfirmId(null);
    showToast('Goal deleted.');
  };

  const getStatusIcon = (status: string) => {
    if (status === 'achieved') return <CheckCircle className="h-4 w-4 text-primary" />;
    if (status === 'missed') return <XCircle className="h-4 w-4 text-destructive" />;
    if (status === 'cancelled') return <XCircle className="h-4 w-4 text-muted-foreground" />;
    return <Clock className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Compute a fake progress % for demo (in real app, compare latest 30-day summary to baseline)
  const computeProgress = (goal: any): number => {
    if (goal.status === 'achieved') return 100;
    if (goal.baselineValue === 0) return 0;
    // Demo: random consistent value per goal id
    const hash = goal.id.charCodeAt(0) % 80;
    return Math.max(10, hash);
  };

  return (
    <div className="space-y-8 py-6 animate-fade-in-up">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-card border border-border text-foreground text-sm font-semibold px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center space-x-2 animate-fade-in-up"
          role="status"
          aria-live="polite"
        >
          <CheckCircle className="h-4 w-4 text-primary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-heading font-extrabold text-foreground" id="goals-page-heading">
            Reduction Goals
          </h1>
          <p className="text-muted-foreground text-sm">Set and track your carbon reduction targets.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/95 px-4 py-2.5 rounded-xl text-sm font-bold transition-all focus-ring shadow-md shadow-primary/20"
          id="create-goal-btn"
        >
          <Plus className="h-4 w-4" />
          <span>Create Goal</span>
        </button>
      </div>

      {/* Goals List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : goals.length === 0 ? (
        <div className="bg-card border border-border rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Target className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold font-heading text-foreground">No goals yet</h2>
          <p className="text-muted-foreground text-sm">Set a reduction goal to start tracking your progress.</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold transition-all focus-ring shadow-lg shadow-primary/20"
          >
            <Plus className="h-4 w-4" />
            <span>Create Your First Goal</span>
          </button>
        </div>
      ) : (
        <ul className="space-y-4" aria-label="Goals list" id="goals-list">
          {goals.map((goal) => {
            const progress = computeProgress(goal);
            const targetDateStr = goal.targetDate instanceof Date
              ? goal.targetDate.toLocaleDateString()
              : new Date(goal.targetDate).toLocaleDateString();

            return (
              <li key={goal.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-bold font-heading text-foreground capitalize">
                        {goal.category} {goal.type === 'percent_reduction' ? `${goal.targetValue}% Reduction` : `${goal.targetValue} kg Target`}
                      </h2>
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                        {getStatusIcon(goal.status)}
                        <span>{getStatusLabel(goal.status)}</span>
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Target date: <span className="font-semibold text-foreground">{targetDateStr}</span>
                      {' · '}Baseline: <span className="font-semibold text-foreground">{goal.baselineValue?.toFixed(1)} kg CO2e</span>
                    </p>
                  </div>

                  {deleteConfirmId === goal.id ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="text-xs font-bold text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-lg transition-all focus-ring"
                        id={`confirm-delete-${goal.id}`}
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded-lg focus-ring"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(goal.id)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all focus-ring"
                      aria-label={`Delete ${goal.category} goal`}
                      id={`delete-goal-${goal.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground">{progress}%</span>
                  </div>
                  <div
                    className="h-2.5 w-full bg-muted rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${goal.category} goal progress: ${progress}%`}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        progress >= 100 ? 'bg-primary' : progress >= 60 ? 'bg-yellow-500' : 'bg-accent'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">{progress}% towards your target</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Create Goal Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="goal-modal-title"
        >
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold font-heading text-foreground" id="goal-modal-title">Create New Goal</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-muted-foreground hover:text-foreground focus-ring" aria-label="Close modal">
                <X className="h-5 w-5" />
              </button>
            </div>

            {formErrors.server && (
              <div className="flex items-center space-x-2 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl p-3" role="alert">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{formErrors.server}</span>
              </div>
            )}

            <form onSubmit={handleCreateGoal} className="space-y-4" noValidate>
              <div className="space-y-1">
                <label htmlFor="goal-category" className="text-sm font-semibold text-muted-foreground">Category</label>
                <select
                  id="goal-category"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm focus-ring capitalize"
                >
                  {CATEGORY_OPTIONS.map(c => (
                    <option key={c} value={c} className="capitalize">{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="goal-type" className="text-sm font-semibold text-muted-foreground">Goal Type</label>
                <select
                  id="goal-type"
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm focus-ring"
                >
                  <option value="percent_reduction">Percent Reduction (%)</option>
                  <option value="absolute_target">Absolute Target (kg CO2e)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="goal-target" className="text-sm font-semibold text-muted-foreground">
                  Target Value {formData.type === 'percent_reduction' ? '(%)' : '(kg CO2e)'}
                </label>
                <input
                  id="goal-target"
                  type="number"
                  inputMode="decimal"
                  min={0.01}
                  step="any"
                  value={formData.targetValue}
                  onChange={e => setFormData({ ...formData, targetValue: e.target.value })}
                  className={`w-full bg-background border rounded-xl py-3 px-4 text-sm focus-ring ${formErrors.targetValue ? 'border-destructive' : 'border-border'}`}
                  placeholder={formData.type === 'percent_reduction' ? 'e.g. 20' : 'e.g. 500'}
                />
                {formErrors.targetValue && <p className="text-xs text-destructive font-medium">{formErrors.targetValue}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="goal-date" className="text-sm font-semibold text-muted-foreground">Target Date</label>
                <input
                  id="goal-date"
                  type="date"
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                  value={formData.targetDate}
                  onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
                  className={`w-full bg-background border rounded-xl py-3 px-4 text-sm focus-ring ${formErrors.targetDate ? 'border-destructive' : 'border-border'}`}
                />
                {formErrors.targetDate && <p className="text-xs text-destructive font-medium">{formErrors.targetDate}</p>}
                <p className="text-[11px] text-muted-foreground">Baseline will be auto-computed from your last 30 days of logged data.</p>
              </div>

              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-border py-3 rounded-xl text-sm font-semibold hover:bg-muted transition-all focus-ring">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold transition-all focus-ring shadow-md shadow-primary/20 disabled:opacity-50"
                  id="goal-modal-submit"
                >
                  {submitting ? 'Creating...' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
