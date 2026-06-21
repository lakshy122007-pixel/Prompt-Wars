import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Zap, Utensils, Trash2, Droplet, ArrowRight } from 'lucide-react';

const LogPicker: React.FC = () => {
  const categories = [
    {
      id: 'transport',
      name: 'Transport',
      description: 'Commutes, flights, train travels, public transits',
      icon: Car,
      color: 'text-primary bg-primary/10 border-primary/20 hover:bg-primary/15',
      accentColor: 'group-hover:text-primary'
    },
    {
      id: 'energy',
      name: 'Energy & Electricity',
      description: 'Electricity consumption, gas statement values',
      icon: Zap,
      color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/15',
      accentColor: 'group-hover:text-yellow-500'
    },
    {
      id: 'food',
      name: 'Food & Diet',
      description: 'Beef, poultry, vegetarian, or vegan meals eaten',
      icon: Utensils,
      color: 'text-orange-500 bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/15',
      accentColor: 'group-hover:text-orange-500'
    },
    {
      id: 'waste',
      name: 'Waste & Recycling',
      description: 'Landfill bags, mixed recyclables weights',
      icon: Trash2,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/15',
      accentColor: 'group-hover:text-purple-500'
    },
    {
      id: 'water',
      name: 'Water Usage',
      description: 'Treated household water statements (litres)',
      icon: Droplet,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/15',
      accentColor: 'group-hover:text-blue-500'
    }
  ];

  return (
    <div className="space-y-8 py-6 animate-fade-in-up">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-extrabold text-foreground" id="log-picker-heading">
          Log Carbon Activity
        </h1>
        <p className="text-muted-foreground text-sm">
          Select a category below to record your activities and estimate your carbon footprint.
        </p>
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="grid" aria-labelledby="log-picker-heading">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              to={`/log/${cat.id}`}
              className="group bg-card border border-border rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-all focus-ring min-h-[160px] text-left outline-none"
              role="row"
              aria-label={`Log ${cat.name} activity`}
              id={`log-select-${cat.id}`}
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${cat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold font-heading text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1 text-xs font-semibold text-primary mt-4 self-end group-hover:translate-x-1 transition-transform">
                <span>Select</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default LogPicker;
