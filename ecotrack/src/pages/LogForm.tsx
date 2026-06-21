import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { useActivities } from '../hooks/useActivities.js';
import { calculateActivityCo2e, ActivityCategory, EMISSION_FACTORS, activitySchema } from '@ecotrack/shared';
import { ArrowLeft, Calculator, Calendar, Check, AlertCircle } from 'lucide-react';

const LogForm: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { logActivity } = useActivities();

  // Validate route parameter
  const validCategories: ActivityCategory[] = ['transport', 'energy', 'food', 'waste', 'water'];
  const activeCategory = category as ActivityCategory;

  if (!validCategories.includes(activeCategory)) {
    return <Navigate to="/log" replace />;
  }

  // Subtypes options based on category emission factor keys
  const categoryFactors = EMISSION_FACTORS[activeCategory] || {};
  const subtypes = Object.keys(categoryFactors).map(key => ({
    key,
    label: categoryFactors[key].label,
    unit: categoryFactors[key].unit
  }));

  // Form states
  const [subtype, setSubtype] = useState(subtypes[0]?.key || '');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [loggedAt, setLoggedAt] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  
  // Custom states for Transport passengers
  const [passengers, setPassengers] = useState<number>(1);

  // Preview / Calculation states
  const [previewCo2e, setPreviewCo2e] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Update unit label when subtype changes
  const activeSubtypeConfig = subtypes.find(s => s.key === subtype);
  const unitLabel = activeSubtypeConfig ? activeSubtypeConfig.unit : '';

  // Live Carbon Preview Calculation (instant feedback)
  useEffect(() => {
    if (quantity === '' || quantity <= 0 || !subtype) {
      setPreviewCo2e(null);
      return;
    }

    try {
      let calc = calculateActivityCo2e({
        category: activeCategory,
        subtype,
        quantity: Number(quantity)
      });

      let finalCo2e = calc.co2eKg;
      // Carpool divisor adjustment if transport carpool
      if (activeCategory === 'transport' && passengers > 1) {
        finalCo2e = finalCo2e / passengers;
      }

      setPreviewCo2e(Number(finalCo2e.toFixed(2)));
    } catch (err) {
      setPreviewCo2e(null);
    }
  }, [subtype, quantity, passengers, activeCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setSubmitError(null);

    const payload = {
      category: activeCategory,
      subtype,
      quantity: Number(quantity),
      loggedAt: new Date(loggedAt).toISOString(),
      notes: notes || null
    };

    // Client-side schema checks
    const parsed = activitySchema.safeParse(payload);
    if (!parsed.success) {
      const errorsObj: Record<string, string> = {};
      parsed.error.issues.forEach(issue => {
        if (issue.path[0]) {
          errorsObj[issue.path[0] as string] = issue.message;
        }
      });
      setFieldErrors(errorsObj);
      return;
    }

    setSubmitting(true);
    try {
      // If transport, we can divide the logged quantity or adjust parameter
      // We pass passengers in notes or handle it. To keep baseline factor calculation intact,
      // we divide the quantity sent by passenger count or scale.
      // Let's divide quantity by passengers before logging to reflect individual share!
      let quantityToLog = Number(quantity);
      if (activeCategory === 'transport' && passengers > 1) {
        quantityToLog = quantityToLog / passengers;
      }

      await logActivity({
        category: activeCategory,
        subtype,
        quantity: quantityToLog,
        loggedAt: new Date(loggedAt).toISOString(),
        notes: notes ? `${notes} (${passengers} passengers)` : notes
      });

      // Optimistic redirect
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'Failed to record activity on server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6 animate-fade-in-up">
      {/* Back button */}
      <Link 
        to="/log" 
        className="inline-flex items-center space-x-1 text-sm font-semibold text-muted-foreground hover:text-foreground focus-ring rounded-md p-1"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Categories</span>
      </Link>

      {/* Main card */}
      <div className="bg-card border border-border rounded-2xl p-8 shadow-md space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-heading font-extrabold text-foreground capitalize" id="log-form-heading">
            Log {activeCategory}
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter details to calculate and record emissions footprint.
          </p>
        </div>

        {/* Server Errors */}
        {submitError && (
          <div className="flex items-center space-x-2 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl p-4" role="alert">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="font-semibold">{submitError}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          
          {/* Subtype Select */}
          <div className="space-y-1">
            <label htmlFor="subtype-select" className="text-sm font-semibold text-muted-foreground">
              Activity Type
            </label>
            <select
              id="subtype-select"
              value={subtype}
              onChange={(e) => setSubtype(e.target.value)}
              disabled={submitting}
              className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm focus-ring"
            >
              {subtypes.map(s => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Numeric Quantity input */}
          <div className="space-y-1">
            <label htmlFor="quantity-input" className="text-sm font-semibold text-muted-foreground">
              Quantity ({unitLabel})
            </label>
            <input
              id="quantity-input"
              type="number"
              inputMode="decimal"
              min={0.01}
              step="any"
              required
              disabled={submitting}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder={`Enter amount in ${unitLabel}`}
              className={`w-full bg-background border rounded-xl py-3 px-4 text-sm focus-ring transition-all ${
                fieldErrors.quantity ? 'border-destructive ring-destructive' : 'border-border'
              }`}
            />
            {fieldErrors.quantity && (
              <p className="text-xs text-destructive font-semibold" id="quantity-error">{fieldErrors.quantity}</p>
            )}
          </div>

          {/* Optional passenger count for car rides */}
          {activeCategory === 'transport' && (subtype.startsWith('car_') || subtype === 'bus') && (
            <div className="space-y-1 animate-fade-in-up">
              <label htmlFor="passengers-input" className="text-sm font-semibold text-muted-foreground">
                Number of Occupants (Carpool Division)
              </label>
              <input
                id="passengers-input"
                type="number"
                min={1}
                max={10}
                value={passengers}
                onChange={(e) => setPassengers(Math.max(1, Number(e.target.value)))}
                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm focus-ring"
              />
              <p className="text-xs text-muted-foreground">
                Emissions will be divided equally among passengers.
              </p>
            </div>
          )}

          {/* Date Picker */}
          <div className="space-y-1">
            <label htmlFor="date-input" className="text-sm font-semibold text-muted-foreground">
              Activity Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <input
                id="date-input"
                type="date"
                required
                disabled={submitting}
                max={new Date().toISOString().split('T')[0]} // Block future dates
                value={loggedAt}
                onChange={(e) => setLoggedAt(e.target.value)}
                className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus-ring"
              />
            </div>
          </div>

          {/* Optional Notes */}
          <div className="space-y-1">
            <label htmlFor="notes-input" className="text-sm font-semibold text-muted-foreground">
              Notes (Optional)
            </label>
            <textarea
              id="notes-input"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={submitting}
              placeholder="e.g. Weekly grocery run, electric bill billing period"
              className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm focus-ring resize-none"
              maxLength={500}
            />
          </div>

          {/* Carbon Footprint Live Preview */}
          {previewCo2e !== null && (
            <div 
              className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center space-x-3 text-primary animate-fade-in-up"
              aria-live="polite"
              id="carbon-preview-box"
            >
              <Calculator className="h-6 w-6 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Estimated Carbon Footprint</p>
                <p className="text-xl font-heading font-extrabold text-foreground" id="live-carbon-estimate">
                  ≈ {previewCo2e} <span className="text-sm font-medium text-muted-foreground">kg CO2e</span>
                </p>
              </div>
            </div>
          )}

          {/* Submit / Cancel Buttons */}
          <div className="flex space-x-4">
            <Link
              to="/log"
              className="w-1/2 inline-flex justify-center border border-border bg-card/50 hover:bg-muted text-foreground py-3.5 rounded-xl text-sm font-semibold transition-all focus-ring text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || quantity === ''}
              className="w-1/2 bg-primary text-primary-foreground hover:bg-primary/95 py-3.5 rounded-xl font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center space-x-2 focus-ring disabled:opacity-50"
              id="log-submit-btn"
            >
              <Check className="h-4 w-4" />
              <span>{submitting ? 'Saving...' : 'Record Activity'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogForm;
