import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useDashboardSummary } from '../hooks/useDashboardSummary.js';
import { useGoals } from '../hooks/useGoals.js';
import { Chart } from 'react-google-charts';
import { 
  Flame, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  AlertCircle, 
  ArrowRight, 
  Lightbulb, 
  Leaf 
} from 'lucide-react';
import { getTopCategory, selectTips, Tip } from '@ecotrack/shared';

// Static base tips for fallback/selection
const ALL_TIPS: Tip[] = [
  {
    id: 'tip_carpool',
    title: 'Start Carpooling',
    category: 'transport',
    description: 'Share your daily commute with colleagues or friends. Cutting car use by 50% immediately halves your transport footprint.',
    estimatedAnnualSavingsKg: 450,
    moneySavingDescription: 'Save up to $350 on fuel and parking annually.'
  },
  {
    id: 'tip_beef',
    title: 'Beef-Free Days',
    category: 'food',
    description: 'Swap beef for chicken or plant-based meals twice a week. Beef emissions are over 4 times higher than poultry.',
    estimatedAnnualSavingsKg: 320,
    moneySavingDescription: 'Save $180 on grocery bills.'
  },
  {
    id: 'tip_led',
    title: 'Switch to LED Bulbs',
    category: 'energy',
    description: 'Replace standard lights with LEDs. They use 75% less power and last 25 times longer than incandescent bulbs.',
    estimatedAnnualSavingsKg: 150,
    moneySavingDescription: 'Save $80 on your annual energy bills.'
  },
  {
    id: 'tip_recycle',
    title: 'Sort Recyclables',
    category: 'waste',
    description: 'Ensure metals, cardboard, and plastics do not end up in landfills, where they decay and emit methane.',
    estimatedAnnualSavingsKg: 90,
    moneySavingDescription: 'Avoid local landfill or collection surcharges.'
  },
  {
    id: 'tip_shower',
    title: 'Reduce Shower Times',
    category: 'water',
    description: 'Reduce daily showers by 3 minutes. Treated hot water accounts for substantial direct and heating emissions.',
    estimatedAnnualSavingsKg: 65,
    moneySavingDescription: 'Save $40 on water and gas heating statements.'
  }
];

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const summary = useDashboardSummary();
  const { goals, loading: goalsLoading } = useGoals();
  const [showTable, setShowTable] = useState(false);
  const [activeTip, setActiveTip] = useState<Tip | null>(null);

  // Determine personalized tip based on dashboard aggregates
  useEffect(() => {
    if (summary.loading || summary.empty) {
      // Pick a random starter tip
      setActiveTip(ALL_TIPS[0]);
      return;
    }

    // Compute top category
    // In a real environment, we'd pull the totals from the past 30 days
    // For this client hook, we can mock/estimate CategoryTotals or use this week's
    const mockCategoryTotals = {
      transport: summary.todayCo2e * 3 || 10,
      energy: 15,
      food: 8,
      waste: 2,
      water: 1
    };

    try {
      const topCat = getTopCategory(mockCategoryTotals);
      const filtered = selectTips(topCat, ALL_TIPS);
      if (filtered.length > 0) {
        setActiveTip(filtered[0]);
      } else {
        setActiveTip(ALL_TIPS[0]);
      }
    } catch (err) {
      setActiveTip(ALL_TIPS[0]);
    }
  }, [summary.loading, summary.empty, summary.todayCo2e]);

  if (summary.loading || goalsLoading) {
    return (
      <div className="space-y-8 animate-pulse py-6">
        <div className="h-8 w-48 bg-muted rounded-md"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-muted rounded-2xl"></div>
          ))}
        </div>
        <div className="h-64 bg-muted rounded-2xl"></div>
      </div>
    );
  }

  // Determine active goals (up to 3)
  const activeGoals = goals.filter(g => g.status === 'active').slice(0, 3);

  return (
    <div className="space-y-8 py-6 relative">
      {/* Email Verification Banner */}
      {user && !user.emailVerified && (
        <div 
          className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm rounded-xl p-4 animate-fade-in-up"
          role="banner"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">
              Please verify your email address to secure your account. Check your inbox for the link.
            </span>
          </div>
        </div>
      )}

      {/* Header Greeting */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-extrabold text-foreground" id="dashboard-heading">
          Hello, {profile?.displayName || 'EcoTracker'} 👋
        </h1>
        <Link
          to="/log"
          className="hidden sm:inline-flex items-center space-x-1 bg-primary text-primary-foreground hover:bg-primary/95 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all focus-ring shadow-md shadow-primary/20"
        >
          <Plus className="h-4 w-4" />
          <span>Log Activity</span>
        </Link>
      </div>

      {summary.empty ? (
        /* Empty State */
        <div className="bg-card border border-border rounded-3xl p-12 text-center space-y-6 max-w-xl mx-auto shadow-md">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto animate-bounce">
            <Leaf className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-foreground">Start Your Eco Journey!</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            You haven't logged any carbon footprint activities yet. Log your daily commutes, energy bill details, or meals to visualize your impact.
          </p>
          <Link
            to="/log"
            className="inline-flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/95 px-6 py-3 rounded-xl font-bold transition-all focus-ring shadow-lg shadow-primary/20"
            id="empty-state-log-cta"
          >
            <span>Log Your First Activity</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        /* Populated Dashboard */
        <>
          {/* Summary Cards Row */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-6" aria-label="Footprint Summary Stats">
            <dl className="grid grid-cols-1 gap-6 col-span-2 lg:col-span-4 md:grid-cols-4">
              
              {/* Card 1: Today's CO2e */}
              <div className="bg-card border border-border p-6 rounded-2xl space-y-1 relative shadow-sm">
                <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Today's CO2e</dt>
                <dd className="text-3xl font-heading font-extrabold text-foreground" id="stat-today">
                  {summary.todayCo2e} <span className="text-sm font-medium text-muted-foreground">kg</span>
                </dd>
              </div>

              {/* Card 2: This Week's CO2e */}
              <div className="bg-card border border-border p-6 rounded-2xl space-y-1 relative shadow-sm">
                <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">This Week's CO2e</dt>
                <dd className="text-3xl font-heading font-extrabold text-foreground" id="stat-week">
                  {summary.thisWeekCo2e} <span className="text-sm font-medium text-muted-foreground">kg</span>
                </dd>
              </div>

              {/* Card 3: Week Trend */}
              <div className="bg-card border border-border p-6 rounded-2xl space-y-1 relative shadow-sm">
                <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trend vs Last Week</dt>
                <dd className="flex items-center space-x-1.5">
                  <span className="text-3xl font-heading font-extrabold text-foreground" id="stat-trend">
                    {Math.abs(summary.trendPercentage)}%
                  </span>
                  {summary.trendPercentage > 0 ? (
                    <span className="inline-flex items-center text-xs font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full" aria-label="Increase">
                      <TrendingUp className="h-3.5 w-3.5 mr-0.5" />
                      Up
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full" aria-label="Decrease">
                      <TrendingDown className="h-3.5 w-3.5 mr-0.5" />
                      Down
                    </span>
                  )}
                </dd>
              </div>

              {/* Card 4: Streak */}
              <div className="bg-card border border-border p-6 rounded-2xl space-y-1 relative shadow-sm">
                <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Streak</dt>
                <dd className="flex items-center space-x-1.5">
                  <span className="text-3xl font-heading font-extrabold text-foreground" id="stat-streak">
                    {summary.streakDays}
                  </span>
                  <span className="inline-flex items-center text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full" aria-label="Days streak">
                    <Flame className="h-3.5 w-3.5 mr-0.5 fill-current" />
                    Days
                  </span>
                </dd>
              </div>

            </dl>
          </section>

          {/* Chart Section */}
          <section className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-sm" aria-labelledby="chart-title">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold font-heading text-foreground" id="chart-title">Emissions Trends (Last 7 Days)</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowTable(!showTable)}
                  className="text-xs font-semibold text-primary hover:underline focus-ring rounded-md p-1"
                  aria-label={showTable ? 'Hide data table' : 'View as data table'}
                  id="toggle-chart-table"
                >
                  {showTable ? 'View Chart' : 'View as Table'}
                </button>
                <Link to="/trends" className="text-xs font-semibold text-muted-foreground hover:text-foreground focus-ring rounded-md p-1">
                  View full trends →
                </Link>
              </div>
            </div>

            {/* Layout shift protector height */}
            <div className="min-h-[260px] flex items-center justify-center">
              {showTable ? (
                /* Accessible alternative table view */
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse" id="dashboard-chart-table">
                    <caption>Accessible tabular representation of weekly carbon emissions</caption>
                    <thead>
                      <tr className="border-b border-border">
                        <th scope="col" className="py-2 font-bold text-muted-foreground">Date</th>
                        <th scope="col" className="py-2 font-bold text-muted-foreground text-right">CO2e (kg)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.dailyChartData.map((row, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="py-2">{row[0]}</td>
                          <td className="py-2 text-right">{row[1]} kg</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Google Chart */
                <Chart
                  width={'100%'}
                  height={'260px'}
                  chartType="LineChart"
                  loader={<div className="h-64 bg-muted rounded-xl w-full animate-pulse"></div>}
                  data={[
                    ['Day', 'CO2e (kg)'],
                    ...summary.dailyChartData
                  ]}
                  options={{
                    backgroundColor: 'transparent',
                    colors: ['#10b981'], // Emerald Primary
                    curveType: 'function',
                    legend: 'none',
                    chartArea: { width: '85%', height: '80%' },
                    hAxis: {
                      textStyle: { color: '#9ca3af', fontName: 'Inter' },
                      gridlines: { color: 'transparent' }
                    },
                    vAxis: {
                      textStyle: { color: '#9ca3af', fontName: 'Inter' },
                      gridlines: { color: '#374151' },
                      baselineColor: '#374151'
                    }
                  }}
                />
              )}
            </div>
          </section>

          {/* Lower Grid (Tips & Goals) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Top Tip of the Day */}
            {activeTip && (
              <section className="bg-card border border-border p-6 rounded-2xl space-y-4 flex flex-col justify-between shadow-sm" aria-labelledby="tip-title">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-primary">
                    <Lightbulb className="h-5 w-5" />
                    <h2 className="text-lg font-bold font-heading text-foreground" id="tip-title">Tip of the Day</h2>
                  </div>
                  <h3 className="font-heading font-bold text-base text-foreground" id="active-tip-title">{activeTip.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{activeTip.description}</p>
                </div>

                <div className="border-t border-border pt-3 space-y-1">
                  <p className="text-xs text-primary font-bold">Estimated Savings: ~{activeTip.estimatedAnnualSavingsKg} kg CO2e/year</p>
                  <p className="text-xs text-accent font-semibold">{activeTip.moneySavingDescription}</p>
                </div>
              </section>
            )}

            {/* Active Goals Progress */}
            <section className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-sm" aria-labelledby="goals-title">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold font-heading text-foreground" id="goals-title">Active Goals</h2>
                <Link to="/goals" className="text-xs font-semibold text-primary hover:underline focus-ring rounded-md p-1">
                  Manage goals →
                </Link>
              </div>

              {activeGoals.length === 0 ? (
                <div className="h-36 flex flex-col items-center justify-center text-center space-y-2">
                  <p className="text-sm text-muted-foreground">No active goals found.</p>
                  <Link to="/goals" className="text-xs font-semibold text-primary hover:underline focus-ring p-1 rounded">
                    Set a reduction goal now
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4" id="dashboard-goals-list">
                  {activeGoals.map((g) => {
                    // Compute a basic progress value
                    // For percent reduction: calculate if they have moved towards the target
                    // This is for demonstration. If baseline is 100, and target is 80 (20% reduction)
                    // and current emissions are 90, progress is 50%
                    const progress = 45; // Mock progress value
                    return (
                      <li key={g.id} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-foreground capitalize">{g.category} Reduction</span>
                          <span className="text-muted-foreground">{progress}% Complete</span>
                        </div>
                        <div 
                          className="h-2 w-full bg-muted rounded-full overflow-hidden"
                          role="progressbar"
                          aria-valuenow={progress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${g.category} reduction goal progress`}
                        >
                          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Target: {g.type === 'percent_reduction' ? `${g.targetValue}% reduction` : `${g.targetValue} kg CO2e`} by {new Date(g.targetDate).toLocaleDateString()}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

          </div>
        </>
      )}

      {/* Floating Action Button for Mobile / Easy Access */}
      <Link
        to="/log"
        className="fixed bottom-6 right-6 sm:hidden bg-primary text-primary-foreground p-4 rounded-full shadow-2xl shadow-primary/45 transition-transform hover:scale-105 active:scale-95 focus-ring z-40"
        aria-label="Log a new activity"
        id="floating-log-btn"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
};

export default Dashboard;
