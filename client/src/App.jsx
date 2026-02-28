import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';

// Pages
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import InterviewSession from './pages/InterviewSession';
import PersonalizedInterview from './pages/PersonalizedInterview';
import Feedback from './pages/Feedback';
import Profile from './pages/Profile';
import CVUpload from './pages/CVUpload';
import SystemStatus from './pages/SystemStatus';
import CodingPractice from './pages/CodingPractice';

// Components
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" richColors />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/interview" element={<PrivateRoute><Interview /></PrivateRoute>} />
          <Route path="/interview/:id" element={<PrivateRoute><InterviewSession /></PrivateRoute>} />
          <Route path="/personalized-interview" element={<PrivateRoute><PersonalizedInterview /></PrivateRoute>} />
          <Route path="/coding-practice" element={<PrivateRoute><CodingPractice /></PrivateRoute>} />
          <Route path="/feedback/:id" element={<PrivateRoute><Feedback /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/cv-upload" element={<PrivateRoute><CVUpload /></PrivateRoute>} />
          <Route path="/system-status" element={<PrivateRoute><SystemStatus /></PrivateRoute>} />

          {/* Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
