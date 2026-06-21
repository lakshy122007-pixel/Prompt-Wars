import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Award, Compass, TrendingDown, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="space-y-24 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20 lg:py-24 rounded-3xl bg-gradient-to-br from-card to-background border border-border shadow-xl">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 translate-y-1/2 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

        <div className="relative max-w-4xl mx-auto text-center px-4 space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            <Leaf className="h-3.5 w-3.5" />
            <span>Empowering Daily Action</span>
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-foreground leading-[1.1]">
            Track, Understand, and <br />
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Reduce Your Carbon Footprint
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
            Stop guessing about your environmental impact. Log transport, energy, food, waste, and water in seconds, visualize trends, and get personalized savings tips.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/95 px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-primary/25 transition-all focus-ring group"
              id="hero-signup-cta"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5 transform transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center border border-border bg-card/50 hover:bg-muted text-foreground px-8 py-4 rounded-xl text-base font-semibold transition-all focus-ring"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            Everything you need for sustainable living
          </h2>
          <p className="text-muted-foreground">
            EcoTrack bridges the gap between deep analytics and actionable everyday sustainability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card border border-border p-8 rounded-2xl space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Leaf className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold font-heading">Easy Loggers</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Log transport distances, energy statements, food items, waste weights, and water usage in under 15 seconds.
            </p>
          </div>

          <div className="bg-card border border-border p-8 rounded-2xl space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <TrendingDown className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold font-heading">Interactive Trends</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Visualize daily, weekly, monthly, and annual footprint breakdowns and trace comparisons against national averages.
            </p>
          </div>

          <div className="bg-card border border-border p-8 rounded-2xl space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold font-heading">Actionable Goals</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Set custom target reductions and earn achievements. Choose to join Leaderboards to spark friendly community actions.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-card border border-border rounded-3xl p-8 md:p-12 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-foreground">How EcoTrack Works</h2>
          <p className="text-muted-foreground">Three simple steps to shift your lifestyle footprint.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex w-10 h-10 rounded-full bg-primary/20 text-primary text-lg font-bold items-center justify-center">1</div>
            <h3 className="text-lg font-bold font-heading">Log Your Day</h3>
            <p className="text-muted-foreground text-sm">Enter simple values like km driven, electric bill kWh, or type of meals eaten.</p>
          </div>

          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex w-10 h-10 rounded-full bg-primary/20 text-primary text-lg font-bold items-center justify-center">2</div>
            <h3 className="text-lg font-bold font-heading">Analyze Carbon Output</h3>
            <p className="text-muted-foreground text-sm">The dashboard aggregates your data. See your CO2e calculated authoritatively on our server.</p>
          </div>

          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex w-10 h-10 rounded-full bg-primary/20 text-primary text-lg font-bold items-center justify-center">3</div>
            <h3 className="text-lg font-bold font-heading">Optimize & Reduce</h3>
            <p className="text-muted-foreground text-sm">Review personalized reduction suggestions, set goals, and find local recycling hubs on the map.</p>
          </div>
        </div>
      </section>

      {/* Data Sourcing & Trust Section */}
      <section className="text-center max-w-3xl mx-auto space-y-4 py-6 border-t border-border">
        <div className="inline-flex items-center space-x-2 text-muted-foreground text-sm">
          <Compass className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground">Sourced with Scientific Rigor</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          All calculated greenhouse gas (GHG) emission factors are authoritative and pulled from peer-reviewed scientific studies and international agency standards, including the **UK Department for Environment, Food & Rural Affairs (DEFRA 2024)**, the **US Environmental Protection Agency (EPA eGRID 2023 & WARM)**, and food system footprinting calculations published by **Poore & Nemecek (2018)**.
        </p>
      </section>
    </div>
  );
};

export default LandingPage;
