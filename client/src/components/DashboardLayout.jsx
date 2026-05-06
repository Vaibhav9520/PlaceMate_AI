import TopNavbar from './TopNavbar';
import { useTheme } from '../context/ThemeContext';

const DashboardLayout = ({ children }) => {
  const { dark } = useTheme();
  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#080B14]' : 'bg-[#F8FAFC]'}`} data-theme={dark ? 'dark' : 'light'}>
      {/* ambient glow for dark mode */}
      {dark && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
        </div>
      )}
      <TopNavbar />
      <div className="w-full relative z-10">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
