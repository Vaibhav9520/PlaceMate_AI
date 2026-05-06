import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
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

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" richColors />
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/general-interview" element={<PrivateRoute><GeneralInterview /></PrivateRoute>} />
          <Route path="/interview" element={<Navigate to="/general-interview" replace />} />
          <Route path="/face-to-face-interview" element={<PrivateRoute><FaceToFaceInterview /></PrivateRoute>} />
          <Route path="/personalized-interview" element={<PrivateRoute><PersonalizedInterview /></PrivateRoute>} />
          <Route path="/interview-session" element={<PrivateRoute><InterviewSession /></PrivateRoute>} />
          <Route path="/coding-practice" element={<PrivateRoute><CodingPractice /></PrivateRoute>} />
          <Route path="/company-questions" element={<PrivateRoute><CompanyQuestions /></PrivateRoute>} />
          <Route path="/feedback/:id" element={<PrivateRoute><InterviewFeedback /></PrivateRoute>} />
          <Route path="/feedback/local" element={<PrivateRoute><InterviewFeedback /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/cv-upload" element={<PrivateRoute><UpdateCV /></PrivateRoute>} />

          {/* Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
