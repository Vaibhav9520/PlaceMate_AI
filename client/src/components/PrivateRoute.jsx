import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { dark } = useTheme();

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${dark ? 'bg-[#080B14]' : 'bg-[#F8FAFC]'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/sign-in" replace />;
};

export default PrivateRoute;
