import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ArrowLeft, Video, Clock, AlertCircle, Wrench } from 'lucide-react';

const FaceToFaceInterview = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/general-interview')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Interview Setup</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Video className="w-16 h-16 text-blue-600" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Face-to-Face AI Interview
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Interactive voice-based interview experience with real-time AI conversation
          </p>

          {/* Status Card */}
          <Card className="p-8 mb-8 max-w-2xl mx-auto border-orange-200 bg-orange-50">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-orange-600" />
              <h2 className="text-2xl font-semibold text-orange-900">
                Service Temporarily Unavailable
              </h2>
            </div>
            
            <p className="text-orange-800 mb-6 text-lg">
              We're currently working on enhancing our Face-to-Face AI Interview feature to provide you with the best possible experience.
            </p>

            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-600" />
                What we're improving:
              </h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Advanced voice recognition and natural language processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Real-time AI conversation with contextual follow-up questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Enhanced audio quality and noise cancellation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Improved feedback analysis and scoring algorithms</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-center gap-2 text-orange-700 mb-4">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Expected availability: Coming Soon</span>
            </div>
          </Card>

          {/* Alternative Options */}
          <Card className="p-6 mb-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Try Our Available Interview Modes
            </h3>
            <p className="text-gray-600 mb-6">
              While we work on the Face-to-Face feature, you can practice with our other interview modes:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-left">
                  <h4 className="font-medium text-green-900">Role-Based General Interview</h4>
                  <p className="text-sm text-green-700">Text-based interview with voice input support</p>
                </div>
                <Button
                  onClick={() => navigate('/general-interview')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Try Now
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-left">
                  <h4 className="font-medium text-blue-900">Personalized CV-Based Interview</h4>
                  <p className="text-sm text-blue-700">Questions tailored to your resume and experience</p>
                </div>
                <Button
                  onClick={() => navigate('/personalized-interview')}
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  Try Now
                </Button>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-4">
              Want to be notified when Face-to-Face interviews are available?
            </p>
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="mx-auto"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FaceToFaceInterview;