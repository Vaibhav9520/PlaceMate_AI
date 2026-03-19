import { Link } from 'react-router-dom';
import { ArrowRight, Upload, Play, BarChart3, Target, Brain, TrendingUp } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-white to-[#F1F5F9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#111827]">PlaceMate AI</h1>
          </div>
          <div className="space-x-4">
            <Link
              to="/sign-in"
              className="px-6 py-2 text-[#6366F1] hover:text-[#5855EB] font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="primary-button"
            >
              Get Started
            </Link>
          </div>
        </nav>

        <div className="text-center">
          <h2 className="text-6xl font-bold text-[#111827] mb-6 leading-tight">
            Master Your Career Preparation with AI
          </h2>
          <p className="text-xl text-[#6B7280] mb-12 max-w-4xl mx-auto leading-relaxed">
            Practice real technical questions, receive instant AI feedback, and improve your coding and communication skills with AI-powered guidance.
          </p>

          <div className="flex justify-center gap-6 mb-16">
            <Link
              to="/sign-up"
              className="flex items-center gap-3 px-8 py-4 bg-[#6366F1] text-white rounded-lg text-lg font-semibold hover:bg-[#5855EB] transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <Play className="w-5 h-5" />
              Start Practice
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/cv-upload"
              className="flex items-center gap-3 px-8 py-4 bg-white text-[#6366F1] border-2 border-[#6366F1] rounded-lg text-lg font-semibold hover:bg-[#6366F1] hover:text-white transition-all duration-200"
            >
              <Upload className="w-5 h-5" />
              Upload Resume
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-xl shadow-lg p-8 card-hover border border-[#E5E7EB]">
              <div className="w-16 h-16 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#111827]">Personalized Questions</h3>
              <p className="text-[#6B7280] leading-relaxed">
                Get interview questions tailored to your resume and target role with AI-powered analysis
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 card-hover border border-[#E5E7EB]">
              <div className="w-16 h-16 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#111827]">AI-Powered Feedback</h3>
              <p className="text-[#6B7280] leading-relaxed">
                Receive detailed analysis and improvement suggestions with real-time AI guidance
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 card-hover border border-[#E5E7EB]">
              <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-xl flex items-center justify-center mb-6 mx-auto">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-[#111827]">Track Progress</h3>
              <p className="text-[#6B7280] leading-relaxed">
                Monitor your improvement with comprehensive analytics and performance insights
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 bg-white rounded-2xl shadow-xl p-12 border border-[#E5E7EB]">
            <h3 className="text-3xl font-bold text-[#111827] mb-8">Trusted by Students Worldwide</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#6366F1] mb-2">10K+</div>
                <div className="text-[#6B7280] font-medium">Practice Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#22C55E] mb-2">95%</div>
                <div className="text-[#6B7280] font-medium">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#8B5CF6] mb-2">500+</div>
                <div className="text-[#6B7280] font-medium">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#F59E0B] mb-2">24/7</div>
                <div className="text-[#6B7280] font-medium">AI Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#111827] text-[#E5E7EB] mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">PlaceMate AI</h3>
              </div>
              <p className="text-[#9CA3AF] leading-relaxed">
                An AI-powered preparation platform that helps students practice technical and behavioral questions with real-time feedback and personalized learning.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-[#9CA3AF]">
                <li><Link to="/dashboard" className="hover:text-[#6366F1] transition-colors">Practice Sessions</Link></li>
                <li><Link to="/coding-practice" className="hover:text-[#6366F1] transition-colors">Coding Practice</Link></li>
                <li><Link to="/company-questions" className="hover:text-[#6366F1] transition-colors">Company Preparation</Link></li>
                <li><Link to="/cv-upload" className="hover:text-[#6366F1] transition-colors">Resume Analyzer</Link></li>
                <li><Link to="/general-interview" className="hover:text-[#6366F1] transition-colors">AI Mock Practice</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-[#9CA3AF]">
                <li><a href="#" className="hover:text-[#6366F1] transition-colors">Preparation Tips</a></li>
                <li><a href="#" className="hover:text-[#6366F1] transition-colors">DSA Guide</a></li>
                <li><a href="#" className="hover:text-[#6366F1] transition-colors">Resume Guide</a></li>
                <li><a href="#" className="hover:text-[#6366F1] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[#6366F1] transition-colors">Help Center</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-[#9CA3AF]">
                <li><a href="#" className="hover:text-[#6366F1] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#6366F1] transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-[#6366F1] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#6366F1] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#6366F1] transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#374151] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#9CA3AF]">© 2026 PlaceMate AI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-[#9CA3AF] hover:text-[#6366F1] transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="text-[#9CA3AF] hover:text-[#6366F1] transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="text-[#9CA3AF] hover:text-[#6366F1] transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
