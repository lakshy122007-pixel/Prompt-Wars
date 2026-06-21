import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { firestoreService } from '../services/firestoreService.js';
import { Trophy, Flame, Shield, LogIn, CheckCircle, X } from 'lucide-react';

const Community: React.FC = () => {
  const { profile } = useAuth();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [optingIn, setOptingIn] = useState(false);
  const [handleInput, setHandleInput] = useState('');
  const [handleError, setHandleError] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const isOptedIn = profile?.communityOptIn === true;

  useEffect(() => {
    if (!isOptedIn) { setLoading(false); return; }
    const unsub = firestoreService.subscribeToLeaderboard((members) => {
      setLeaderboard(members);
      setLoading(false);
    });
    return () => unsub();
  }, [isOptedIn]);

  const handleOptIn = async () => {
    if (!handleInput.trim() || handleInput.trim().length < 3) {
      setHandleError('Choose a display handle of at least 3 characters.');
      return;
    }
    setHandleError('');
    setOptingIn(true);
    try {
      await firestoreService.updateCommunityOptIn({ optIn: true, handle: handleInput.trim() });
      showToast('You have joined the EcoTrack community! 🎉');
    } catch (err: any) {
      setHandleError(err.message || 'Failed to opt in.');
    } finally {
      setOptingIn(false);
    }
  };

  const handleOptOut = async () => {
    setOptingIn(true);
    try {
      await firestoreService.updateCommunityOptIn({ optIn: false });
      setLeaderboard([]);
      showToast('You have left the community leaderboard.');
    } catch (err: any) {
      console.error(err);
    } finally {
      setOptingIn(false);
    }
  };

  const MOCK_CHALLENGES = [
    { id: 'ch1', title: 'Meatless Monday Week', description: 'Go vegetarian every Monday for 4 weeks.', participants: 312, unit: 'kg CO2e saved', icon: '🥦' },
    { id: 'ch2', title: 'Commute-Free Friday', description: 'Work from home or use transit every Friday this month.', participants: 198, unit: 'km driven avoided', icon: '🚌' },
    { id: 'ch3', title: 'Zero Landfill Week', description: 'Compost or recycle all waste for 7 days straight.', participants: 156, unit: 'kg diverted', icon: '♻️' },
  ];

  return (
    <div className="space-y-8 py-6 animate-fade-in-up">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-card border border-border text-foreground text-sm font-semibold px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center space-x-2 animate-fade-in-up" role="status" aria-live="polite">
          <CheckCircle className="h-4 w-4 text-primary" />
          <span>{toast}</span>
        </div>
      )}

      <div className="space-y-1">
        <h1 className="text-3xl font-heading font-extrabold text-foreground" id="community-heading">Community Challenges</h1>
        <p className="text-muted-foreground text-sm">Opt in to join anonymized leaderboards and group eco-challenges.</p>
      </div>

      {/* Privacy Notice */}
      <div className="flex items-start space-x-3 bg-accent/5 border border-accent/20 text-accent rounded-2xl p-5">
        <Shield className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-sm">
          <p className="font-bold text-foreground">Privacy-first community</p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            The leaderboard shows only your chosen display handle and percentile rank — never your real name, email, or exact emission totals. You can opt out anytime.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leaderboard Section */}
        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5" aria-labelledby="leaderboard-heading">
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h2 className="text-lg font-bold font-heading text-foreground" id="leaderboard-heading">Community Leaderboard</h2>
          </div>

          {!isOptedIn ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Join the community to see and participate in the leaderboard.</p>
              <div className="space-y-2">
                <label htmlFor="handle-input" className="text-sm font-semibold text-muted-foreground">Choose your community handle</label>
                <input
                  id="handle-input"
                  type="text"
                  value={handleInput}
                  onChange={e => setHandleInput(e.target.value)}
                  placeholder="e.g. GreenAanya21"
                  className={`w-full bg-background border rounded-xl py-3 px-4 text-sm focus-ring ${handleError ? 'border-destructive' : 'border-border'}`}
                  maxLength={30}
                />
                {handleError && <p className="text-xs text-destructive font-medium">{handleError}</p>}
              </div>
              <button
                onClick={handleOptIn}
                disabled={optingIn}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold transition-all focus-ring shadow-md shadow-primary/20 flex items-center justify-center space-x-2 disabled:opacity-50"
                id="community-optin-btn"
              >
                <LogIn className="h-4 w-4" />
                <span>{optingIn ? 'Joining...' : 'Join Community'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Your handle: <span className="font-bold text-primary">{profile?.communityHandle}</span>
                </p>
                <button
                  onClick={handleOptOut}
                  disabled={optingIn}
                  className="text-xs text-muted-foreground hover:text-destructive flex items-center space-x-1 focus-ring rounded-md p-1"
                  id="community-optout-btn"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Leave</span>
                </button>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-muted rounded-xl animate-pulse" />)}
                </div>
              ) : (
                <div>
                  <table className="w-full text-sm" aria-label="Community leaderboard rankings">
                    <caption className="sr-only">Community leaderboard — ordered by percentile rank, lowest to highest footprint</caption>
                    <thead>
                      <tr className="border-b border-border">
                        <th scope="col" className="py-2 text-left text-xs font-bold text-muted-foreground">#</th>
                        <th scope="col" className="py-2 text-left text-xs font-bold text-muted-foreground">Handle</th>
                        <th scope="col" className="py-2 text-right text-xs font-bold text-muted-foreground">Percentile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.slice(0, 10).map((member, i) => (
                        <tr key={member.uid} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                          <td className="py-2.5 font-bold text-muted-foreground">{i + 1}</td>
                          <td className="py-2.5 font-semibold text-foreground flex items-center space-x-1.5">
                            {i < 3 && <span>{'🥇🥈🥉'[i]}</span>}
                            <span>{member.handle}</span>
                          </td>
                          <td className="py-2.5 text-right">
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                              Top {member.percentileRank}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {leaderboard.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-6">No community members yet. Invite friends!</p>
                  )}

                  {/* Pagination */}
                  <nav className="flex justify-center mt-4 space-x-2" aria-label="Leaderboard pages">
                    <button className="px-3 py-1.5 text-xs font-semibold border border-border rounded-lg hover:bg-muted focus-ring" aria-label="Previous page" disabled>
                      ←
                    </button>
                    <span className="px-3 py-1.5 text-xs font-bold bg-primary/10 text-primary rounded-lg" aria-current="page">1</span>
                    <button className="px-3 py-1.5 text-xs font-semibold border border-border rounded-lg hover:bg-muted focus-ring" aria-label="Next page">
                      →
                    </button>
                  </nav>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Active Challenges */}
        <section className="space-y-5" aria-labelledby="challenges-heading">
          <div className="flex items-center space-x-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-bold font-heading text-foreground" id="challenges-heading">Active Challenges</h2>
          </div>

          <ul className="space-y-4" id="challenges-list">
            {MOCK_CHALLENGES.map(challenge => (
              <li key={challenge.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl" role="img" aria-hidden="true">{challenge.icon}</span>
                      <h3 className="text-base font-bold font-heading text-foreground">{challenge.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">{challenge.description}</p>
                    <p className="text-[11px] text-muted-foreground font-medium">
                      <span className="text-primary font-bold">{challenge.participants}</span> participants
                    </p>
                  </div>
                </div>
                <button
                  className="w-full border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground py-2.5 rounded-xl text-sm font-bold transition-all focus-ring"
                  id={`join-challenge-${challenge.id}`}
                  aria-label={`Join ${challenge.title} challenge`}
                >
                  Join Challenge
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Community;
