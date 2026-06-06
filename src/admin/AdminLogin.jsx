import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { getStoredAdmin, storeAdminSession } from '../lib/authStorage.js';

export default function AdminLogin() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const session = getStoredAdmin();
  const redirectTo = location.state?.from || '/admin/dashboard';

  if (session) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (data.user?.role !== 'admin') {
        throw new Error('Admin access required');
      }

      storeAdminSession(data);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-4 py-10 text-ink">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg bg-silk shadow-soft lg:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden bg-berry p-10 text-white lg:block">
          <ShieldCheck size={38} />
          <h1 className="mt-6 font-display text-4xl font-bold">Selyn's Couture Admin</h1>
          <p className="mt-4 leading-7 text-white/78">
            Secure owner access for products, orders, training applications, and uniform requests.
          </p>
        </div>
        <form onSubmit={submit} className="p-6 sm:p-10">
          <LockKeyhole className="text-berry" size={34} />
          <h2 className="mt-5 text-2xl font-bold">Admin login</h2>
          <p className="mt-2 text-sm text-ink/65">Unauthorized users are redirected here before admin pages load.</p>
          <div className="mt-7 grid gap-4">
            <label className="block text-sm font-bold">
              Email
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-md border border-ink/15 px-3 py-3 font-normal outline-none focus:border-berry"
              />
            </label>
            <label className="block text-sm font-bold">
              Password
              <input
                name="password"
                type="password"
                required
                className="mt-2 w-full rounded-md border border-ink/15 px-3 py-3 font-normal outline-none focus:border-berry"
              />
            </label>
          </div>
          <button disabled={loading} className="primary-button mt-6 w-full justify-center disabled:opacity-60">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          {message && <p className="mt-4 rounded-md bg-blush/25 px-4 py-3 text-sm font-semibold text-berry">{message}</p>}
        </form>
      </section>
    </main>
  );
}
