import { Link, useLocation } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TopNavbar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  // Check if user is admin
  const isAdmin = user?.email === 'vaibhavsingh01080@gmail.com';

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/general-interview', label: 'AI Interview' },
    { path: '/company-questions', label: 'Company Questions' },
    // Only show Question Manager for admin
    ...(isAdmin ? [{ path: '/question-manager', label: 'Question Manager' }] : []),
    { path: '/cv-upload', label: 'Upload CV' },
    { path: '/profile', label: 'Profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-[#E5E7EB] px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-[#111827]">PlaceMate AI</h1>
        </Link>

        {/* Navigation Menu */}
        <div className="flex items-center gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'text-[#6366F1]'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* User Menu - Only Sign Out */}
        <div className="flex items-center">
          <button
            onClick={logout}
            className="text-sm font-medium text-[#DC2626] hover:text-[#B91C1C] transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;