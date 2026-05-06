import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const TopNavbar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const { dark, toggleTheme } = useTheme();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/general-interview', label: 'Mock Interview' },
    { path: '/company-questions', label: 'Company Questions' },
    { path: '/coding-practice', label: 'DSA Practice' },
    { path: '/cv-upload', label: 'Resume' },
    { path: '/profile', label: 'Profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 px-6 py-4 border-b transition-colors duration-300 ${
      dark
        ? 'bg-[#080B14]/90 backdrop-blur-xl border-white/10'
        : 'bg-white/90 backdrop-blur-xl border-slate-200 shadow-sm'
    }`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src="/MY_LOGO.png" alt="PlaceMate AI" className="w-8 h-8 object-contain" />
          <span className={`text-lg font-bold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
            PlaceMate AI
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'text-indigo-500'
                  : dark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
              dark ? 'bg-white/10 hover:bg-white/15 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={logout}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              dark ? 'text-rose-400 hover:text-rose-300' : 'text-rose-500 hover:text-rose-600'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
