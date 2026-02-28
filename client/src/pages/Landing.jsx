import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-3xl font-bold text-primary">PlaceMate AI</h1>
          <div className="space-x-4">
            <Link
              to="/sign-in"
              className="px-6 py-2 text-primary hover:text-primary-600"
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-600"
            >
              Get Started
            </Link>
          </div>
        </nav>

        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            Ace Your Next Interview with AI
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Practice with AI-powered mock interviews, get personalized feedback,
            and track your progress. PlaceMate AI helps you prepare for success.
          </p>

          <div className="flex justify-center gap-4 mb-16">
            <Link
              to="/sign-up"
              className="px-8 py-4 bg-primary text-white rounded-lg text-lg font-semibold hover:bg-primary-600 transition"
            >
              Start Practicing Free
            </Link>
            <Link
              to="/sign-in"
              className="px-8 py-4 bg-white text-primary border-2 border-primary rounded-lg text-lg font-semibold hover:bg-primary-50 transition"
            >
              Sign In
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Personalized Questions</h3>
              <p className="text-gray-600">
                Get interview questions tailored to your CV and target role
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Feedback</h3>
              <p className="text-gray-600">
                Receive detailed analysis and improvement suggestions
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your improvement with comprehensive statistics
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
