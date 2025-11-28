import { useMemo, useState } from 'react';
import axios from 'axios';
import { FaRegEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';

function InputForm({ setIsOpen }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const copy = useMemo(
    () =>
      isSignUp
        ? {
            badge: 'New here?',
            title: 'Create your foodie account',
            subtitle: 'Save favourites, publish recipes, and join the community.',
            cta: 'Create account',
            switchLabel: 'Already have an account?',
            switchAction: 'Sign in instead',
          }
        : {
            badge: 'Welcome back',
            title: 'Sign in to FoodRecipe',
            subtitle: 'Pick up where you left off and keep cooking.',
            cta: 'Sign in',
            switchLabel: "Don't have an account?",
            switchAction: 'Create one now',
          },
    [isSignUp],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const endpoint = isSignUp ? 'signUp' : 'login';
      const { data } = await axios.post(`${apiBaseUrl}/${endpoint}`, form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('auth-change'));
      setIsOpen();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const disableSubmit = loading || !form.email || form.password.length < 6;

  return (
    <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-gray-100 bg-white/90 shadow-2xl">
      <div className="grid gap-6 p-6 md:grid-cols-5">
        <div className="space-y-4 md:col-span-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {copy.badge}
          </span>
          <h2 className="text-2xl font-bold text-text-main">{copy.title}</h2>
          <p className="text-sm text-text-muted">{copy.subtitle}</p>
          <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 p-4 text-xs text-text-muted">
            🔐 Your credentials are encrypted and never shared.
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-gray-100 bg-white/80 p-4 md:col-span-3"
        >
          <label className="block text-sm font-medium text-text-main">
            Email address
            <div className="mt-2 flex items-center rounded-xl border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-primary/30">
              <span className="px-3 text-primary">
                <FaRegEnvelope />
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-r-xl border-l border-gray-100 bg-transparent px-3 py-2 text-sm outline-none"
                placeholder="you@email.com"
                required
              />
            </div>
          </label>

          <label className="block text-sm font-medium text-text-main">
            Password
            <div className="mt-2 flex items-center rounded-xl border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-primary/30">
              <span className="px-3 text-primary">
                <FaLock />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                minLength={6}
                onChange={handleChange}
                className="w-full border-l border-gray-100 bg-transparent px-3 py-2 text-sm outline-none"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="px-3 text-gray-400 transition hover:text-primary"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <span className="mt-1 block text-xs text-text-muted">
              {isSignUp ? 'Must be at least 6 characters.' : 'Keep your account secure.'}
            </span>
          </label>

          {error && <div className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>}

          <button
            type="submit"
            disabled={disableSubmit}
            className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:opacity-95 disabled:opacity-60"
          >
            {loading ? 'Please wait...' : copy.cta}
          </button>

          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-text-main transition hover:border-primary/40 hover:text-primary"
          >
            <FaGoogle className="text-secondary" /> Continue with Google
          </button>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-text-muted">
            <div>
              {copy.switchLabel}{' '}
              <button
                type="button"
                className="font-semibold text-secondary hover:underline"
                onClick={() => setIsSignUp((state) => !state)}
              >
                {copy.switchAction}
              </button>
            </div>
            <button
              type="button"
              className="font-semibold text-primary hover:underline"
              onClick={() => setForm({ email: '', password: '' })}
            >
              Clear form
            </button>
          </div>

          <p className="text-[11px] text-text-muted">
            By continuing you agree to our{' '}
            <span className="text-primary">Terms</span> and <span className="text-primary">Privacy Policy</span>.
          </p>
        </form>
      </div>
    </div>
  );
}

export default InputForm;