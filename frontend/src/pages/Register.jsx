import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { registerUser } from '../services/authService';
import { User, Mail, Lock } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      login(data.data.token, data.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'flex h-9 w-full rounded-[3px] border border-[#d4ccbd] bg-[#f7f4ec] pl-8 pr-3 py-1.5 text-xs text-[#29271f] font-sans placeholder:text-[#514d44]/60 focus:outline-none focus:border-[#8b713a] focus:ring-1 focus:ring-[#8b713a] transition-colors';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f4ec] p-4 font-sans text-[#29271f]">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="rounded-[3px] border border-[#d4ccbd] bg-[#fcfaf5] shadow-[0_4px_20px_rgba(41,39,31,0.06)]">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col items-center text-center mb-6">
              <img
                src="/Remirind_Logo.png"
                alt="Remirind"
                className="h-10 w-10 mb-3 object-contain"
              />
              <span className="text-[10px] uppercase tracking-widest text-[#8b713a] font-medium">
                Enrollment
              </span>
              <h1 className="font-serif text-3xl font-normal tracking-tight text-[#29271f] mt-1">
                Create Account
              </h1>
              <p className="text-xs text-[#514d44] mt-1 font-sans">
                Register with Remirind
              </p>
            </div>

            {error ? (
              <div className="mb-4 rounded-[2px] border border-[#8b2b2b]/30 bg-[#8b2b2b]/10 px-3 py-2 text-xs text-[#8b2b2b]">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-medium text-[#514d44]">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#514d44]/60" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Your legal or preferred name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-medium text-[#514d44]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#514d44]/60" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className={inputClass}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-medium text-[#514d44]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#514d44]/60" />
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Create a secure passphrase"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full mt-2"
                size="default"
              >
                {loading ? 'Creating...' : 'Register'}
              </Button>
            </form>
          </div>

          <div className="border-t border-[#e7e0d3] px-6 py-4 bg-[#f7f4ec]/50 text-center">
            <p className="text-xs text-[#514d44]">
              Already enrolled?{' '}
              <Link
                to="/login"
                className="font-medium text-[#8b713a] hover:text-[#68501f] transition-colors underline underline-offset-2"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
