import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Mail, ShieldCheck, ShieldAlert, ArrowLeft } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in-up">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="font-heading font-extrabold text-3xl text-foreground">Reset Password</h1>
          <p className="text-sm text-muted-foreground">Enter your email and we'll send you a password reset link</p>
        </div>

        {/* Success Alert */}
        {success && (
          <div 
            className="flex items-start space-x-2.5 bg-primary/10 border border-primary/20 text-primary text-sm rounded-xl p-4"
            role="alert"
          >
            <ShieldCheck className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Reset Email Sent</p>
              <p className="text-xs text-muted-foreground mt-0.5">Please check your inbox (and spam folder) for instructions to reset your password.</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div 
            className="flex items-center space-x-2 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl p-4" 
            role="alert"
          >
            <ShieldAlert className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1">
              <label htmlFor="reset-email" className="text-sm font-semibold text-muted-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="reset-email"
                  type="email"
                  required
                  disabled={submitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus-ring transition-all"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !email}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/95 py-3 rounded-xl font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center space-x-2 focus-ring disabled:opacity-50"
              id="reset-submit-btn"
            >
              <span>{submitting ? 'Sending Link...' : 'Send Reset Link'}</span>
            </button>
          </form>
        )}

        {/* Back Link */}
        <div className="text-center pt-2">
          <Link 
            to="/login" 
            className="inline-flex items-center space-x-1 text-sm font-semibold text-muted-foreground hover:text-foreground focus-ring rounded-md p-1"
            id="forgot-back-to-login"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
