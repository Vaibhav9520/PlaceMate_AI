import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'sonner';
import { Lock, Sun, Moon, ArrowRight, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputCls = `w-full border rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors ${
    dark
      ? 'bg-white/5 border-white/10 text-white placeholder-slate-500'
      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
  }`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`, { password });
      if (res.data.success) {
        toast.success('Password reset! Please sign in.');
        navigate('/sign-in');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired link');
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300 ${dark ? 'bg-[#080B14]' : 'bg-white'}`}>
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
        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="flex items-center gap-3">
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

        <div className={`border rounded-2xl p-8 backdrop-blur-sm shadow-2xl transition-colors duration-300 ${
          dark ? 'bg-white/[0.04] border-white/10 shadow-black/40' : 'bg-white border-slate-200 shadow-slate-100'
        }`}>
          <h1 className={`text-2xl font-bold mb-1 ${dark ? 'text-white' : 'text-slate-900'}`}>Set new password</h1>
          <p className={`text-sm mb-8 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            Choose a strong password — at least 6 characters.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${dark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type={showPw ? 'text' : 'password'} required placeholder="New password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${dark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type={showPw ? 'text' : 'password'} required placeholder="Confirm new password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)}
                className={inputCls}
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25">
              {loading ? 'Resetting...' : <><span>Reset password</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>

        <p className={`text-center text-xs mt-6 ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
          <Link to="/sign-in" className={`transition-colors ${dark ? 'text-slate-500 hover:text-indigo-400' : 'text-slate-400 hover:text-indigo-500'}`}>
            ← Back to sign in
          </Link>
          <span className="mx-3">·</span>
          © 2026 PlaceMate AI
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
