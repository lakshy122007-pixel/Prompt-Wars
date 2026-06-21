import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { firestoreService } from '../services/firestoreService.js';
import { getTopCategory, selectTips, Tip, ActivityCategory } from '@ecotrack/shared';
import { Lightbulb, DollarSign, Leaf, Sparkles } from 'lucide-react';

const ALL_TIPS: Tip[] = [
  {
    id: 't_carpool',
    title: 'Switch to Commute Carpooling',
    category: 'transport',
    description: 'Share commutes twice a week. Reducing single-occupancy vehicle driving directly cuts gasoline emissions and extends car lifespans.',
    estimatedAnnualSavingsKg: 460,
    moneySavingDescription: 'Save $380/year on gasoline and tolls.'
  },
  {
    id: 't_transit',
    title: 'Utilize Public Transit',
    category: 'transport',
    description: 'Swap driving for public trains or buses on short trips. Trains and buses emit significantly less carbon per passenger-mile.',
    estimatedAnnualSavingsKg: 580,
    moneySavingDescription: 'Save $450/year in vehicle wear, tear, and parking.'
  },
  {
    id: 't_bike',
    title: 'Active Transport: Bike or Walk',
    category: 'transport',
    description: 'For trips under 3 kilometers, choose to walk or bicycle. This generates zero carbon emissions and promotes cardiorespiratory health.',
    estimatedAnnualSavingsKg: 280,
    moneySavingDescription: 'Save $120/year on fuel and maintenance.'
  },
  {
    id: 't_thermostat',
    title: 'Install a Programmable Thermostat',
    category: 'energy',
    description: 'Lower heating/cooling temperatures by 2°C when away or sleeping. Heating and cooling account for over half of home energy footprints.',
    estimatedAnnualSavingsKg: 340,
    moneySavingDescription: 'Save $150/year on utility bills.'
  },
  {
    id: 't_led',
    title: 'Retrofit with LED Lighting',
    category: 'energy',
    description: 'Upgrade standard household bulbs to EnergyStar LEDs. They consume up to 80% less power and last significantly longer.',
    estimatedAnnualSavingsKg: 180,
    moneySavingDescription: 'Save $85/year on electric bills.'
  },
  {
    id: 't_beef',
    title: 'Adopt Beef-Free Days',
    category: 'food',
    description: 'Swap beef/lamb meals for chicken or legumes twice a week. Beef farming requires vast land and generates high methane emissions.',
    estimatedAnnualSavingsKg: 400,
    moneySavingDescription: 'Save $220/year on grocery shopping.'
  },
  {
    id: 't_vegan',
    title: 'Opt for Plant-Based Lunch Options',
    category: 'food',
    description: 'Enjoy fully vegan/vegetarian lunches. Plant crops require far fewer resources and emit up to 90% less GHG than meat.',
    estimatedAnnualSavingsKg: 260,
    moneySavingDescription: 'Save $110/year on meals.'
  },
  {
    id: 't_landfill',
    title: 'Compost Organic Waste',
    category: 'waste',
    description: 'Divert food waste to compost heaps instead of standard trash bins. Landfill organic decomposition emits strong methane gas.',
    estimatedAnnualSavingsKg: 120,
    moneySavingDescription: 'Avoid local municipal trash bag charges.'
  },
  {
    id: 't_recycle',
    title: 'Verify Mixed Recyclables sorting',
    category: 'waste',
    description: 'Properly wash and sort clean cans, bottles, and boxes. Recycled materials skip energy-intensive raw manufacturing stages.',
    estimatedAnnualSavingsKg: 95,
    moneySavingDescription: 'Avoid municipal sorting penalty fees.'
  },
  {
    id: 't_temp',
    title: 'Wash Laundry with Cold Water',
    category: 'water',
    description: 'Run washing machine cycles at 30°C or cold settings. Heating wash water accounts for 90% of laundry machine energy draw.',
    estimatedAnnualSavingsKg: 110,
    moneySavingDescription: 'Save $60/year on gas or electric heating.'
  },
  {
    id: 't_leak',
    title: 'Repair Household Faucet Leaks',
    category: 'water',
    description: 'Fix dripping faucets and toilets immediately. Small leaks waste thousands of litres of treated utility water annually.',
    estimatedAnnualSavingsKg: 40,
    moneySavingDescription: 'Save $35/year on municipal water bills.'
  }
];

const Tips: React.FC = () => {
  const { user } = useAuth();
  const [topCategory, setTopCategory] = useState<ActivityCategory>('transport');
  const [selectedFilter, setSelectedFilter] = useState<'personalized' | ActivityCategory>('personalized');
  const [displayedTips, setDisplayedTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch summaries to compute top category
  useEffect(() => {
    if (!user) return;

    const unsubscribe = firestoreService.subscribeToDailySummaries(user.uid, (summaries) => {
      if (summaries.length > 0) {
        // Aggregate last 30 days totals
        const totals = { transport: 0, energy: 0, food: 0, waste: 0, water: 0 };
        summaries.forEach(s => {
          const byCat = s.byCategory || {};
          totals.transport += byCat.transport || 0;
          totals.energy += byCat.energy || 0;
          totals.food += byCat.food || 0;
          totals.waste += byCat.waste || 0;
          totals.water += byCat.water || 0;
        });

        try {
          const topCat = getTopCategory(totals);
          setTopCategory(topCat);
        } catch (err) {
          // fallback
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Update tips listing when topCategory or filter changes
  useEffect(() => {
    if (selectedFilter === 'personalized') {
      const filtered = selectTips(topCategory, ALL_TIPS);
      setDisplayedTips(filtered);
    } else {
      const filtered = ALL_TIPS.filter(tip => tip.category === selectedFilter);
      setDisplayedTips(filtered.sort((a, b) => b.estimatedAnnualSavingsKg - a.estimatedAnnualSavingsKg));
    }
  }, [topCategory, selectedFilter]);

  return (
    <div className="space-y-8 py-6 animate-fade-in-up">
      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-extrabold text-foreground" id="tips-heading">
          Personalized Reduction Tips
        </h1>
        <p className="text-muted-foreground text-sm">
          Actionable recommendations based on your carbon metrics and lifestyle.
        </p>
      </div>

      {/* Filter Tabs */}
      <section className="bg-card border border-border p-4 rounded-2xl flex flex-wrap gap-2 shadow-sm" aria-label="Filters">
        <button
          onClick={() => setSelectedFilter('personalized')}
          aria-pressed={selectedFilter === 'personalized'}
          className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold focus-ring transition-all border ${
            selectedFilter === 'personalized'
              ? 'bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20 border-primary'
              : 'bg-background border-border text-muted-foreground hover:text-foreground'
          }`}
          id="tips-filter-personalized"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Recommended For You</span>
        </button>

        {['transport', 'energy', 'food', 'waste', 'water'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat as ActivityCategory)}
            aria-pressed={selectedFilter === cat}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold focus-ring transition-all capitalize border ${
              selectedFilter === cat
                ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm'
                : 'bg-background border-border text-muted-foreground hover:text-foreground'
            }`}
            id={`tips-filter-${cat}`}
          >
            <span>{cat}</span>
          </button>
        ))}
      </section>

      {/* Recommended Header */}
      {selectedFilter === 'personalized' && !loading && (
        <div 
          className="flex items-center space-x-2 bg-primary/10 border border-primary/20 text-primary text-sm rounded-xl p-4 animate-fade-in-up"
          role="note"
        >
          <Lightbulb className="h-5 w-5 flex-shrink-0" />
          <span className="font-semibold">
            Since <span className="underline font-bold capitalize">{topCategory}</span> is your highest footprint source, we recommend focusing on the suggestions below.
          </span>
        </div>
      )}

      {/* Tips List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : displayedTips.length === 0 ? (
        <div className="bg-card border border-border p-12 rounded-2xl text-center text-muted-foreground">
          <p className="text-sm">No tips available for this filter.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-labelledby="tips-heading" id="tips-cards-list">
          {displayedTips.map((tip) => (
            <li 
              key={tip.id} 
              className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-all focus-ring focus:border-primary outline-none"
              tabIndex={0}
              aria-label={`Tip: ${tip.title}`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-bold font-heading text-foreground">{tip.title}</h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                    {tip.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{tip.description}</p>
              </div>

              <div className="border-t border-border pt-4 mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1 text-primary font-bold">
                  <Leaf className="h-4 w-4" />
                  <span>~{tip.estimatedAnnualSavingsKg} kg CO2e/yr</span>
                </div>
                <div className="flex items-center space-x-1 text-accent font-semibold justify-end">
                  <DollarSign className="h-4 w-4" />
                  <span>{tip.moneySavingDescription.replace(/Save /g, '')}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Tips;
