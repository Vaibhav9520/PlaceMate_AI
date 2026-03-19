import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';

// Pages
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CodingPractice from './pages/CodingPractice';
import CompanyQuestions from './pages/CompanyQuestions';
import UpdateCV from './pages/UpdateCV';
import PersonalizedInterview from './pages/PersonalizedInterview';
import GeneralInterview from './pages/GeneralInterview';
import InterviewSession from './pages/InterviewSession';
import InterviewFeedback from './pages/InterviewFeedback';
import FaceToFaceInterview from './pages/FaceToFaceInterview';

// Components
import PrivateRoute from './components/PrivateRoute';

// Placeholder components for removed AI features
const PlaceholderPage = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-600">This feature is temporarily unavailable.</p>
    </div>
  </div>
);

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
          <Route path="/general-interview" element={<PrivateRoute><GeneralInterview /></PrivateRoute>} />
          <Route path="/interview" element={<Navigate to="/general-interview" replace />} />
          <Route path="/face-to-face-interview" element={<PrivateRoute><FaceToFaceInterview /></PrivateRoute>} />
          <Route path="/interview/:id" element={<PrivateRoute><PlaceholderPage title="Interview Session" /></PrivateRoute>} />
          <Route path="/personalized-interview" element={<PrivateRoute><PersonalizedInterview /></PrivateRoute>} />
          <Route path="/interview-session" element={<PrivateRoute><InterviewSession /></PrivateRoute>} />
          <Route path="/coding-practice" element={<PrivateRoute><CodingPractice /></PrivateRoute>} />
          <Route path="/company-questions" element={<PrivateRoute><CompanyQuestions /></PrivateRoute>} />
          <Route path="/question-manager" element={<PrivateRoute><PlaceholderPage title="Question Manager" /></PrivateRoute>} />
          <Route path="/feedback/:id" element={<PrivateRoute><InterviewFeedback /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/cv-upload" element={<PrivateRoute><UpdateCV /></PrivateRoute>} />
          <Route path="/system-status" element={<PrivateRoute><PlaceholderPage title="System Status" /></PrivateRoute>} />
          <Route path="/vapi-test" element={<PrivateRoute><PlaceholderPage title="Voice Test" /></PrivateRoute>} />

          {/* Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
