import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';
import { ArrowRight, Mail, Lock, Sun, Moon } from 'lucide-react';

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData);
    if (result.success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const inputCls = `w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors ${
    dark
      ? 'bg-white/5 border-white/10 text-white placeholder-slate-500'
      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
  }`;

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300 ${dark ? 'bg-[#080B14]' : 'bg-white'}`}>

      {/* ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {dark ? (
          <>
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
            <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[100px]" />
          </>
        ) : (
          <div className="absolute -top-20 left-0 right-0 h-[400px] bg-gradient-to-b from-indigo-50/80 to-transparent" />
        )}
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* logo row + theme toggle */}
        <div className="flex items-center justify-between mb-10">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3">
            <img src="/MY_LOGO.png" alt="PlaceMate AI" className="w-9 h-9 object-contain" />
            <span className={`text-xl font-bold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>PlaceMate AI</span>
          </Link>
          <button
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
              dark ? 'bg-white/10 hover:bg-white/15 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* card */}
        <div className={`border rounded-2xl p-8 backdrop-blur-sm shadow-2xl transition-colors duration-300 ${
          dark ? 'bg-white/[0.04] border-white/10 shadow-black/40' : 'bg-white border-slate-200 shadow-slate-100'
        }`}>
          <h1 className={`text-2xl font-bold mb-1 ${dark ? 'text-white' : 'text-slate-900'}`}>Welcome back</h1>
          <p className={`text-sm mb-8 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            Don't have an account?{' '}
            <Link to="/sign-up" className="text-indigo-500 hover:text-indigo-400 font-medium transition-colors">
              Sign up free
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${dark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input id="email" name="email" type="email" required placeholder="Email address"
                value={formData.email} onChange={handleChange} className={inputCls} />
            </div>
            <div className="relative">
              <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${dark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input id="password" name="password" type="password" required placeholder="Password"
                value={formData.password} onChange={handleChange} className={inputCls} />
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className={`text-xs transition-colors ${dark ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-500 hover:text-indigo-500'}`}>
                Forgot password?
              </Link>
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 mt-2">
              {loading ? 'Signing in...' : <><span>Sign in</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>

        <p className={`text-center text-xs mt-6 ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
          {user ? (
            <Link to="/dashboard" className={`transition-colors ${dark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-500 hover:text-indigo-600'}`}>
              ← Back to Dashboard
            </Link>
          ) : (
            <Link to="/" className={`transition-colors ${dark ? 'text-slate-500 hover:text-indigo-400' : 'text-slate-400 hover:text-indigo-500'}`}>
              ← Back to home
            </Link>
          )}
          <span className="mx-3">·</span>
          © 2026 PlaceMate AI
        </p>
      </div>
    </div>
  );
};

export default SignIn;
