import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { functionsService } from '../services/functionsService.js';
import { initAnalytics } from '../services/firebaseConfig.js';
import {
  User, Bell, Shield, Download, Trash2,
  CheckCircle, AlertCircle
} from 'lucide-react';

interface SettingsProps {
  defaultTab?: 'profile' | 'privacy';
}

const Settings: React.FC<SettingsProps> = ({ defaultTab = 'profile' }) => {
  const { user, profile, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy'>(defaultTab);

  // Profile fields
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [units, setUnits] = useState<'metric' | 'imperial'>(profile?.unitsPreference || 'metric');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Notification prefs
  const [weeklyDigest, setWeeklyDigest] = useState(profile?.weeklyDigestEnabled ?? true);
  const [savingNotif, setSavingNotif] = useState(false);

  // Privacy / Analytics consent
  const [analyticsConsent, setAnalyticsConsent] = useState(profile?.analyticsConsent ?? false);
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  // Export
  const [exporting, setExporting] = useState<'csv' | 'pdf' | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  // Account deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePhrase, setDeletePhrase] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const EXPECTED_PHRASE = 'DELETE MY ACCOUNT';

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      await updateProfile({ displayName, unitsPreference: units });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to save.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSavingNotif(true);
    try {
      await updateProfile({ weeklyDigestEnabled: weeklyDigest });
    } catch (err) { console.error(err); }
    finally { setSavingNotif(false); }
  };

  const handleSavePrivacy = async () => {
    setSavingPrivacy(true);
    try {
      await updateProfile({ analyticsConsent });
      await initAnalytics(analyticsConsent);
    } catch (err) { console.error(err); }
    finally { setSavingPrivacy(false); }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    setExporting(format);
    setExportError(null);
    try {
      const url = await functionsService.exportUserData(format);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ecotrack-data.${format === 'pdf' ? 'txt' : 'csv'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: any) {
      setExportError(err.message || 'Export failed. Max 3 exports per hour.');
    } finally {
      setExporting(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (deletePhrase !== EXPECTED_PHRASE) {
      setDeleteError(`Please type "${EXPECTED_PHRASE}" exactly to confirm.`);
      return;
    }
    setDeleting(true);
    setDeleteError(null);
    try {
      await functionsService.deleteUserAccount(EXPECTED_PHRASE);
      await logout();
    } catch (err: any) {
      setDeleteError(err.message || 'Account deletion failed.');
      setDeleting(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Data', icon: Shield },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6 animate-fade-in-up">
      <div className="space-y-1">
        <h1 className="text-3xl font-heading font-extrabold text-foreground" id="settings-heading">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your profile, preferences, and account data.</p>
      </div>

      {/* Tab Nav */}
      <div className="flex border-b border-border" role="tablist" aria-label="Settings sections">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={active}
              aria-controls={`settings-panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-4 py-3 text-sm font-semibold border-b-2 transition-all focus-ring ${
                active ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
              id={`settings-tab-${tab.id}`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <section id="settings-panel-profile" role="tabpanel" aria-labelledby="settings-tab-profile" className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold font-heading text-foreground">Profile Information</h2>

          {profileMsg && (
            <div className={`flex items-center space-x-2 text-sm rounded-xl p-3 ${profileMsg.type === 'success' ? 'bg-primary/10 border border-primary/20 text-primary' : 'bg-destructive/10 border border-destructive/20 text-destructive'}`} role="alert" aria-live="polite">
              {profileMsg.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <span className="font-medium">{profileMsg.text}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="settings-name" className="text-sm font-semibold text-muted-foreground">Display Name</label>
              <input
                id="settings-name"
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm focus-ring"
                maxLength={60}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-muted-foreground">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-muted-foreground opacity-60 cursor-not-allowed"
              />
              <p className="text-[11px] text-muted-foreground">Email cannot be changed here. Contact support.</p>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-semibold text-muted-foreground">Units Preference</span>
              <div className="flex space-x-3" role="group" aria-label="Units preference">
                {(['metric', 'imperial'] as const).map(u => (
                  <button
                    key={u}
                    onClick={() => setUnits(u)}
                    aria-pressed={units === u}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all focus-ring capitalize ${
                      units === u ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={savingProfile}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold transition-all focus-ring shadow-md shadow-primary/20 disabled:opacity-50"
              id="save-profile-btn"
            >
              {savingProfile ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </section>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <section id="settings-panel-notifications" role="tabpanel" aria-labelledby="settings-tab-notifications" className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold font-heading text-foreground">Notification Preferences</h2>

          <div className="flex items-center justify-between py-4 border-b border-border">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">Weekly Digest Email</h3>
              <p className="text-xs text-muted-foreground">Receive a weekly summary of your carbon footprint by email.</p>
            </div>
            <button
              onClick={() => setWeeklyDigest(!weeklyDigest)}
              role="switch"
              aria-checked={weeklyDigest}
              aria-label="Toggle weekly digest email"
              className={`relative w-12 h-6 rounded-full transition-colors focus-ring ${weeklyDigest ? 'bg-primary' : 'bg-muted'}`}
              id="weekly-digest-toggle"
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${weeklyDigest ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <button
            onClick={handleSaveNotifications}
            disabled={savingNotif}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold transition-all focus-ring shadow-md shadow-primary/20 disabled:opacity-50"
            id="save-notifications-btn"
          >
            {savingNotif ? 'Saving...' : 'Save Preferences'}
          </button>
        </section>
      )}

      {/* Privacy & Data Tab */}
      {activeTab === 'privacy' && (
        <section id="settings-panel-privacy" role="tabpanel" aria-labelledby="settings-tab-privacy" className="space-y-6">

          {/* Analytics Consent */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold font-heading text-foreground">Analytics & Tracking</h2>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">Usage Analytics (GA4)</h3>
                <p className="text-xs text-muted-foreground">Help improve EcoTrack by sharing anonymized usage analytics.</p>
              </div>
              <button
                onClick={() => setAnalyticsConsent(!analyticsConsent)}
                role="switch"
                aria-checked={analyticsConsent}
                aria-label="Toggle analytics consent"
                className={`relative w-12 h-6 rounded-full transition-colors focus-ring ${analyticsConsent ? 'bg-primary' : 'bg-muted'}`}
                id="analytics-consent-toggle"
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${analyticsConsent ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            <button
              onClick={handleSavePrivacy}
              disabled={savingPrivacy}
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold transition-all focus-ring shadow-md shadow-primary/20 disabled:opacity-50"
              id="save-privacy-btn"
            >
              {savingPrivacy ? 'Saving...' : 'Save Privacy Settings'}
            </button>
          </div>

          {/* Data Export */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold font-heading text-foreground">Export My Data</h2>
            <p className="text-sm text-muted-foreground">Download all your logged activities, goals, and profile data. Max 3 exports per hour.</p>

            {exportError && (
              <div className="flex items-center space-x-2 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl p-3" role="alert">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{exportError}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleExport('csv')}
                disabled={!!exporting}
                className="flex items-center space-x-2 border border-border bg-card hover:bg-muted px-5 py-2.5 rounded-xl text-sm font-semibold transition-all focus-ring disabled:opacity-50"
                id="export-csv-btn"
              >
                <Download className="h-4 w-4" />
                <span>{exporting === 'csv' ? 'Generating...' : 'Export as CSV'}</span>
              </button>
              <button
                onClick={() => handleExport('pdf')}
                disabled={!!exporting}
                className="flex items-center space-x-2 border border-border bg-card hover:bg-muted px-5 py-2.5 rounded-xl text-sm font-semibold transition-all focus-ring disabled:opacity-50"
                id="export-pdf-btn"
              >
                <Download className="h-4 w-4" />
                <span>{exporting === 'pdf' ? 'Generating...' : 'Export as PDF Report'}</span>
              </button>
            </div>
          </div>

          {/* Account Deletion */}
          <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold font-heading text-destructive">Delete Account</h2>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This action is irreversible and will erase all activities, goals, and profile information.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center space-x-2 border border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground px-5 py-2.5 rounded-xl text-sm font-bold transition-all focus-ring"
              id="open-delete-modal-btn"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete My Account</span>
            </button>
          </div>
        </section>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
          <div className="bg-card border border-destructive/30 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5 animate-fade-in-up">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
                <Trash2 className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-bold font-heading text-foreground" id="delete-modal-title">Permanently Delete Account?</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This will delete all your activities, goals, summaries, and community data. Your authentication account will also be permanently removed.
              </p>
            </div>

            {deleteError && (
              <div className="flex items-center space-x-2 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl p-3" role="alert">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="delete-confirm-phrase" className="text-sm font-semibold text-muted-foreground">
                Type <span className="font-mono font-bold text-destructive">{EXPECTED_PHRASE}</span> to confirm:
              </label>
              <input
                id="delete-confirm-phrase"
                type="text"
                value={deletePhrase}
                onChange={e => setDeletePhrase(e.target.value)}
                placeholder={EXPECTED_PHRASE}
                className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm font-mono focus-ring"
                autoComplete="off"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => { setShowDeleteModal(false); setDeletePhrase(''); setDeleteError(null); }}
                className="flex-1 border border-border py-3 rounded-xl text-sm font-semibold hover:bg-muted transition-all focus-ring"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || deletePhrase !== EXPECTED_PHRASE}
                className="flex-1 bg-destructive text-destructive-foreground py-3 rounded-xl text-sm font-bold transition-all focus-ring disabled:opacity-40"
                id="confirm-delete-account-btn"
              >
                {deleting ? 'Deleting...' : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
