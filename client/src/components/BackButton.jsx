import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show back button on dashboard (home page)
  if (location.pathname === '/dashboard' || location.pathname === '/') {
    return null;
  }

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to dashboard if no history
      navigate('/dashboard');
    }
  };

  return (
    <button
      onClick={handleBack}
      className="absolute top-6 left-6 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900 flex items-center justify-center"
      title="Go back"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
};

export default BackButton;