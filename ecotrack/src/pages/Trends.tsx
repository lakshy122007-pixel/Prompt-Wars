import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { firestoreService } from '../services/firestoreService.js';
import { Chart } from 'react-google-charts';

const NATIONAL_AVERAGES: Record<string, number> = {
  day: 15.2,
  week: 106.4,
  month: 456.0,
  year: 5472.0
};

const Trends: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Get range and categories from URL params (defaults if missing)
  const range = searchParams.get('range') || 'week';
  const categoriesParam = searchParams.get('categories') || 'transport,energy,food,waste,water';
  const selectedCategories = categoriesParam.split(',').filter(Boolean);

  const [dailySummaries, setDailySummaries] = useState<any[]>([]);
  const [weeklySummaries, setWeeklySummaries] = useState<any[]>([]);
  const [monthlySummaries, setMonthlySummaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(false);

  // 2. Fetch Aggregated Summaries
  useEffect(() => {
    if (!user) return;

    const unsubDaily = firestoreService.subscribeToDailySummaries(user.uid, (data) => {
      setDailySummaries(data);
    });

    const unsubWeekly = firestoreService.subscribeToWeeklySummaries(user.uid, (data) => {
      setWeeklySummaries(data);
      setLoading(false);
    });

    const unsubMonthly = firestoreService.subscribeToMonthlySummaries(user.uid, (data) => {
      setMonthlySummaries(data);
    });

    return () => {
      unsubDaily();
      unsubWeekly();
      unsubMonthly();
    };
  }, [user]);

  // Update search parameters
  const updateRange = (newRange: string) => {
    setSearchParams({ range: newRange, categories: categoriesParam });
  };

  const toggleCategory = (cat: string) => {
    let nextCategories = [...selectedCategories];
    if (nextCategories.includes(cat)) {
      nextCategories = nextCategories.filter(c => c !== cat);
    } else {
      nextCategories.push(cat);
    }
    setSearchParams({ range, categories: nextCategories.join(',') });
  };

  // Get active dataset based on range
  const getDataset = () => {
    if (range === 'day') {
      return [...dailySummaries].reverse().slice(-7);
    }
    if (range === 'week') {
      return [...dailySummaries].reverse().slice(-14);
    }
    if (range === 'month') {
      return [...weeklySummaries].reverse().slice(-8);
    }
    // year
    return [...monthlySummaries].reverse().slice(-12);
  };

  const rawData = getDataset();

  // Process data for total line chart vs National Average
  const processLineChartData = () => {
    const header = ['Period', 'Your Emissions (kg)', 'National Avg (kg)'];
    const rows = rawData.map(item => {
      let label = '';
      if (item.date) {
        label = new Date(`${item.date}T00:00:00.000Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
      } else if (item.week) {
        label = item.week; // YYYY-Wxx
      } else if (item.month) {
        label = new Date(`${item.month}-02T00:00:00.000Z`).toLocaleDateString('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' });
      }

      // Filter sum based on selected categories
      let totalEmissions = 0;
      const byCat = item.byCategory || {};
      selectedCategories.forEach(cat => {
        totalEmissions += byCat[cat] || 0;
      });

      const nationalAverage = NATIONAL_AVERAGES[range] || 15;

      return [label, Number(totalEmissions.toFixed(1)), nationalAverage];
    });

    return [header, ...rows];
  };

  // Process data for stacked bar chart category breakdown
  const processBarChartData = () => {
    const catsToShow = ['transport', 'energy', 'food', 'waste', 'water'].filter(c => selectedCategories.includes(c));
    const header = ['Period', ...catsToShow.map(c => c.toUpperCase())];
    
    const rows = rawData.map(item => {
      let label = '';
      if (item.date) {
        label = new Date(`${item.date}T00:00:00.000Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
      } else if (item.week) {
        label = item.week;
      } else if (item.month) {
        label = new Date(`${item.month}-02T00:00:00.000Z`).toLocaleDateString('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' });
      }

      const byCat = item.byCategory || {};
      const rowValues = catsToShow.map(cat => Number((byCat[cat] || 0).toFixed(1)));
      return [label, ...rowValues];
    });

    return [header, ...rows];
  };

  const lineChartData = processLineChartData();
  const barChartData = processBarChartData();
  const hasData = rawData.length > 0;

  return (
    <div className="space-y-8 py-6 animate-fade-in-up">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-extrabold text-foreground" id="trends-heading">
          Emissions Analytics & Trends
        </h1>
        <p className="text-muted-foreground text-sm">
          Review details of your carbon footprint footprint trends over days, weeks, months, or years.
        </p>
      </div>

      {/* Controls Container */}
      <section className="bg-card border border-border p-6 rounded-2xl space-y-6 shadow-sm" aria-label="Filters">
        
        {/* Range Radio Group */}
        <div className="space-y-2">
          <span className="text-sm font-semibold text-muted-foreground" id="range-label">Time Range</span>
          <div className="flex bg-background border border-border rounded-xl p-1 max-w-sm" role="radiogroup" aria-labelledby="range-label">
            {['day', 'week', 'month', 'year'].map((r) => (
              <button
                key={r}
                role="radio"
                aria-checked={range === r}
                onClick={() => updateRange(r)}
                className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg capitalize transition-all focus-ring ${
                  range === r 
                    ? 'bg-primary text-primary-foreground font-bold shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                id={`range-opt-${r}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Checkboxes */}
        <div className="space-y-2">
          <span className="text-sm font-semibold text-muted-foreground" id="category-filter-label">Filter Categories</span>
          <div className="flex flex-wrap gap-2.5" role="group" aria-labelledby="category-filter-label">
            {['transport', 'energy', 'food', 'waste', 'water'].map((cat) => {
              const active = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  aria-pressed={active}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all focus-ring capitalize ${
                    active 
                      ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                      : 'bg-background border-border text-muted-foreground hover:text-foreground'
                  }`}
                  id={`filter-cat-${cat}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

      </section>

      {loading ? (
        <div className="h-64 bg-muted rounded-2xl animate-pulse"></div>
      ) : !hasData ? (
        <div className="bg-card border border-border p-12 rounded-2xl text-center text-muted-foreground">
          <p className="text-sm">No summaries data available. Start by logging activities to calculate trends.</p>
        </div>
      ) : (
        /* Visualizations Section */
        <div className="grid grid-cols-1 gap-8">
          
          {/* Main Line Chart vs National Average */}
          <section className="bg-card border border-border p-6 rounded-2xl space-y-6 shadow-sm" aria-labelledby="line-chart-heading">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold font-heading text-foreground" id="line-chart-heading">
                Footprint vs. National Average
              </h2>
              <button
                onClick={() => setShowTable(!showTable)}
                className="text-xs font-semibold text-primary hover:underline focus-ring rounded-md p-1"
                aria-label={showTable ? 'View Line Chart' : 'View Data Table'}
                id="toggle-trends-table"
              >
                {showTable ? 'View Chart' : 'View Table'}
              </button>
            </div>

            <div className="min-h-[300px]">
              {showTable ? (
                /* Accessible alternative Table */
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse" id="trends-data-table">
                    <caption>Tabular view of carbon emissions vs national average</caption>
                    <thead>
                      <tr className="border-b border-border">
                        <th scope="col" className="py-3 font-bold text-muted-foreground">Period</th>
                        <th scope="col" className="py-3 font-bold text-muted-foreground text-right">Your Carbon (kg)</th>
                        <th scope="col" className="py-3 font-bold text-muted-foreground text-right">National Avg (kg)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineChartData.slice(1).map((row, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="py-2.5 font-medium">{row[0]}</td>
                          <td className="py-2.5 text-right font-bold text-primary">{row[1]} kg</td>
                          <td className="py-2.5 text-right text-muted-foreground">{row[2]} kg</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Line Chart */
                <Chart
                  width={'100%'}
                  height={'300px'}
                  chartType="LineChart"
                  loader={<div className="h-64 bg-muted rounded-xl w-full animate-pulse"></div>}
                  data={lineChartData}
                  options={{
                    backgroundColor: 'transparent',
                    colors: ['#10b981', '#6366f1'], // Emerald vs Indigo
                    curveType: 'function',
                    legend: {
                      position: 'top',
                      textStyle: { color: '#9ca3af', fontName: 'Inter', fontSize: 11 }
                    },
                    chartArea: { width: '85%', height: '70%' },
                    hAxis: {
                      textStyle: { color: '#9ca3af', fontName: 'Inter' }
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

          {/* Stacked Bar Chart Category Breakdown */}
          {!showTable && barChartData.length > 1 && (
            <section className="bg-card border border-border p-6 rounded-2xl space-y-4 shadow-sm" aria-labelledby="bar-chart-heading">
              <h2 className="text-lg font-bold font-heading text-foreground" id="bar-chart-heading">
                Emissions Category Breakdown
              </h2>
              
              <Chart
                width={'100%'}
                height={'300px'}
                chartType="ColumnChart"
                loader={<div className="h-64 bg-muted rounded-xl w-full animate-pulse"></div>}
                data={barChartData}
                options={{
                  isStacked: true,
                  backgroundColor: 'transparent',
                  colors: ['#10b981', '#f59e0b', '#f97316', '#a855f7', '#3b82f6'], // Green, Yellow, Orange, Purple, Blue
                  legend: {
                    position: 'top',
                    textStyle: { color: '#9ca3af', fontName: 'Inter', fontSize: 10 }
                  },
                  chartArea: { width: '85%', height: '70%' },
                  hAxis: {
                    textStyle: { color: '#9ca3af', fontName: 'Inter' }
                  },
                  vAxis: {
                    textStyle: { color: '#9ca3af', fontName: 'Inter' },
                    gridlines: { color: '#374151' },
                    baselineColor: '#374151'
                  }
                }}
              />
            </section>
          )}

        </div>
      )}
    </div>
  );
};

export default Trends;
