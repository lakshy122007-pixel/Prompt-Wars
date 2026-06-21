import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { signUpSchema } from '@ecotrack/shared';
import { Eye, EyeOff, Lock, Mail, User as UserIcon, ShieldAlert, ArrowRight } from 'lucide-react';

const SignUp: React.FC = () => {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'Weak', color: 'bg-destructive' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Live Password Strength Indicator
  useEffect(() => {
    if (!password) {
      setPasswordStrength({ score: 0, label: 'Weak', color: 'bg-destructive' });
      return;
    }
    let score = 0;
    if (password.length >= 10) score++;
    if (/[A-Za-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let label = 'Weak';
    let color = 'bg-destructive';
    if (score === 3) {
      label = 'Fair';
      color = 'bg-yellow-500';
    } else if (score >= 4) {
      label = 'Strong';
      color = 'bg-primary';
    }

    setPasswordStrength({ score, label, color });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    // Prepare payload
    const payload = {
      name,
      email,
      password,
      confirmPassword,
      acceptedTerms
    };

    // Client-side schema validation
    const parsed = signUpSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach(issue => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      // reCAPTCHA Token Generation
      // Under local sandbox running, we generate a mock token
      const recaptchaToken = 'mock-recaptcha-token';

      await signUp({
        name,
        email,
        password,
        confirmPassword,
        acceptedTerms,
        recaptchaToken
      });

      // Redirect to dashboard. Profile shows unverified banner by default
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes('ALREADY_EXISTS')) {
        setServerError('This email address is already registered.');
      } else {
        setServerError(err.message || 'An error occurred during registration.');
      }
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
      setServerError('Google Sign-In failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in-up">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="font-heading font-extrabold text-3xl text-foreground">Create Account</h1>
          <p className="text-sm text-muted-foreground">Start tracking your environmental actions today</p>
        </div>

        {/* Server Errors */}
        {serverError && (
          <div 
            className="flex items-center space-x-2 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl p-4" 
            role="alert"
            id="signup-alert"
          >
            <ShieldAlert className="h-5 w-5 flex-shrink-0" />
            <div className="font-medium">
              {serverError}{' '}
              {serverError.includes('already registered') && (
                <RouterLink to="/login" className="underline font-bold text-primary hover:text-primary/90 ml-1">
                  Log in instead?
                </RouterLink>
              )}
            </div>
          </div>
        )}

        {/* SignUpForm */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Name Field */}
          <div className="space-y-1">
            <label htmlFor="name-input" className="text-sm font-semibold text-muted-foreground">
              Display Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                id="name-input"
                type="text"
                required
                disabled={submitting}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full bg-background border rounded-xl py-3 pl-10 pr-4 text-sm focus-ring transition-all ${
                  errors.name ? 'border-destructive ring-destructive' : 'border-border'
                }`}
                placeholder="Busy Priya"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-destructive font-medium" id="name-error">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
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
                placeholder="priya@ecotrack.org"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive font-medium" id="email-error">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label htmlFor="password-input" className="text-sm font-semibold text-muted-foreground">
              Password
            </label>
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
                placeholder="At least 10 characters"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={submitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-md focus-ring"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Strength:</span>
                  <span 
                    className="font-bold text-foreground" 
                    aria-live="polite" 
                    id="password-strength-label"
                  >
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${passwordStrength.color} transition-all duration-300`} 
                    style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                    role="progressbar"
                    aria-valuenow={passwordStrength.score}
                    aria-valuemin={0}
                    aria-valuemax={4}
                  ></div>
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="text-xs text-destructive font-medium" id="password-error">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1">
            <label htmlFor="confirm-password-input" className="text-sm font-semibold text-muted-foreground">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                id="confirm-password-input"
                type="password"
                required
                disabled={submitting}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full bg-background border rounded-xl py-3 pl-10 pr-4 text-sm focus-ring transition-all ${
                  errors.confirmPassword ? 'border-destructive ring-destructive' : 'border-border'
                }`}
                placeholder="Re-enter password"
                autoComplete="new-password"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive font-medium" id="confirm-password-error">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="space-y-1">
            <div className="flex items-start space-x-2.5">
              <input
                id="terms-checkbox"
                type="checkbox"
                disabled={submitting}
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-border text-primary focus:ring-primary focus-ring mt-1 bg-background"
              />
              <label htmlFor="terms-checkbox" className="text-xs text-muted-foreground leading-normal">
                I accept the{' '}
                <RouterLink to="/settings" className="font-semibold text-primary hover:underline focus-ring rounded-md">
                  Terms of Service
                </RouterLink>{' '}
                and{' '}
                <RouterLink to="/settings/privacy" className="font-semibold text-primary hover:underline focus-ring rounded-md">
                  Privacy Policy
                </RouterLink>
                .
              </label>
            </div>
            {errors.acceptedTerms && (
              <p className="text-xs text-destructive font-medium" id="terms-error">{errors.acceptedTerms}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/95 py-3 rounded-xl font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center space-x-2 focus-ring disabled:opacity-50"
            id="signup-submit-btn"
          >
            <span>{submitting ? 'Registering...' : 'Sign Up'}</span>
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

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={submitting}
          className="w-full flex items-center justify-center space-x-3 border border-border bg-card hover:bg-muted py-3 rounded-xl text-sm font-semibold transition-all focus-ring disabled:opacity-50"
          id="google-signup-btn"
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
          <span>Sign Up with Google</span>
        </button>

        {/* Link to Login */}
        <div className="text-center text-xs text-muted-foreground font-semibold">
          Already have an account?{' '}
          <RouterLink 
            to="/login" 
            className="text-primary hover:underline focus-ring rounded-md p-0.5"
            id="signup-login-link"
          >
            Log in instead
          </RouterLink>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
