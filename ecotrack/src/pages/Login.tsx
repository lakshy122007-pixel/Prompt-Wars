import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { z } from 'zod';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldAlert } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

const Login: React.FC = () => {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    // Client-side schema validation
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      await signInWithEmail(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      // Security decision: prevent user enumeration by throwing a single generic message
      setServerError('Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    setServerError(null);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setServerError('Failed to sign in with Google.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in-up">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="font-heading font-extrabold text-3xl text-foreground">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">Sign in to track your carbon reduction progress</p>
        </div>

        {/* Server Alert Message */}
        {serverError && (
          <div 
            className="flex items-center space-x-2 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl p-4" 
            role="alert"
            aria-live="assertive"
            id="login-alert"
          >
            <ShieldAlert className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">{serverError}</span>
          </div>
        )}

        {/* EmailPasswordForm */}
        <form onSubmit={handleEmailSignIn} className="space-y-4" noValidate>
          {/* Email field */}
          <div className="space-y-1">
            <label htmlFor="email-input" className="text-sm font-semibold text-muted-foreground">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                id="email-input"
                type="email"
                required
                disabled={submitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-background border rounded-xl py-3 pl-10 pr-4 text-sm focus-ring transition-all ${
                  errors.email ? 'border-destructive ring-destructive' : 'border-border'
                }`}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive font-medium" id="email-error">{errors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label htmlFor="password-input" className="text-sm font-semibold text-muted-foreground">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                required
                disabled={submitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-background border rounded-xl py-3 pl-10 pr-12 text-sm focus-ring transition-all ${
                  errors.password ? 'border-destructive ring-destructive' : 'border-border'
                }`}
                placeholder="••••••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={submitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-md focus-ring"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                id="password-toggle"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive font-medium" id="password-error">{errors.password}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link 
              to="/forgot-password" 
              className="text-xs font-semibold text-primary hover:underline focus-ring rounded-md p-0.5"
              id="login-forgot-password-link"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/95 py-3 rounded-xl font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center space-x-2 focus-ring disabled:opacity-50"
            id="login-submit-btn"
          >
            <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
            {!submitting && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground font-semibold">Or continue with</span>
          </div>
        </div>

        {/* GoogleSignInButton */}
        <button
          onClick={handleGoogleSignIn}
          disabled={submitting}
          className="w-full flex items-center justify-center space-x-3 border border-border bg-card hover:bg-muted py-3 rounded-xl text-sm font-semibold transition-all focus-ring disabled:opacity-50"
          id="google-login-btn"
        >
          <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.65 1.42 7.54l3.79 2.94C6.1 7.51 8.84 5.04 12 5.04z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.7-4.97 3.7-8.62z"
            />
            <path
              fill="#FBBC05"
              d="M5.21 14.81c-.24-.72-.38-1.49-.38-2.31s.14-1.59.38-2.31L1.42 7.25C.52 9.07 0 11.09 0 13.25c0 2.16.52 4.18 1.42 6l3.79-2.94z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.89c-1.04.7-2.38 1.11-4.23 1.11-3.16 0-5.9-2.47-6.79-5.44l-3.79 2.94C3.37 20.35 7.35 23 12 23z"
            />
          </svg>
          <span>Sign In with Google</span>
        </button>

        {/* Link to SignUp */}
        <div className="text-center text-xs text-muted-foreground font-semibold">
          Don't have an account?{' '}
          <Link 
            to="/signup" 
            className="text-primary hover:underline focus-ring rounded-md p-0.5"
            id="login-signup-link"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
