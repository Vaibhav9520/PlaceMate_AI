import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Play, 
  Code, 
  Building2, 
  Database, 
  Upload, 
  History, 
  User, 
  Settings,
  Brain,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/general-interview', label: 'Practice', icon: Play },
    { path: '/coding-practice', label: 'Coding Practice', icon: Code },
    { path: '/company-questions', label: 'Company Preparation', icon: Building2 },
    { path: '/question-manager', label: 'Question Bank', icon: Database },
    { path: '/cv-upload', label: 'Resume Analyzer', icon: Upload },
    { path: '/system-status', label: 'Preparation History', icon: History },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white border-r border-[#E5E7EB] h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-[#111827]">PlaceMate AI</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-[#6366F1] text-white shadow-lg'
                      : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Settings & Logout */}
      <div className="p-4 border-t border-[#E5E7EB]">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] transition-all duration-200 mb-2"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#DC2626] hover:bg-[#FEF2F2] transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;