import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { isGoogleClientConfigured, requestProfileAccessToken, fetchGoogleProfile } from '../lib/google';

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleReady = isGoogleClientConfigured();

  const from = (location.state as { from?: { pathname: string } } | undefined)?.from?.pathname ?? '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error ?? 'Could not log in.');
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const token = await requestProfileAccessToken();
      const profile = await fetchGoogleProfile(token);
      loginWithGoogle(profile.name ?? profile.email.split('@')[0], profile.email);
      navigate(from, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Google sign-in failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-white">Welcome back to CareerFlow</h1>
          <p className="mt-1 text-sm text-muted">Reach the right people. Track every conversation.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <Input label="Email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <Input label="Password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" fullWidth loading={loading}>Log In</Button>

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button type="button" variant="secondary" fullWidth onClick={handleGoogleLogin} loading={googleLoading} disabled={!googleReady}>
            Continue with Google
          </Button>
          {!googleReady && (
            <p className="text-center text-[11px] text-muted">
              Google sign-in needs VITE_GOOGLE_CLIENT_ID configured.
            </p>
          )}
          <p className="text-center text-[11px] text-muted">
            Local Authentication — credentials are stored only in this browser, for demo purposes.
          </p>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Don't have an account?{' '}
          <Link to="/signup" className="focus-ring rounded font-medium text-primary hover:text-primary-hover">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
