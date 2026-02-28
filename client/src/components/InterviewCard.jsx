import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent, CardFooter } from './ui/Card';
import { formatRelativeTime } from '../utils/helpers';
import { Calendar, Code, TrendingUp, Trash2, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const InterviewCard = ({ interview, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this interview?')) {
      return;
    }

    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete(interview.id);
        toast.success('Interview deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting interview:', error);
      toast.error('Failed to delete interview');
    } finally {
      setIsDeleting(false);
    }
  };

  // Get gradient based on interview type
  const getGradient = () => {
    switch (interview.type) {
      case 'personalized':
        return 'from-purple-500 to-pink-500';
      case 'technical':
        return 'from-blue-500 to-cyan-500';
      case 'hr':
        return 'from-green-500 to-teal-500';
      default:
        return 'from-primary to-primary-600';
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
      {/* Gradient Header */}
      <div className={`relative h-40 bg-gradient-to-br ${getGradient()} overflow-hidden`}>
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
        </div>
        
        {/* Delete Button */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all z-10 group"
          title="Delete interview"
        >
          <Trash2 className="w-4 h-4 text-white group-hover:text-red-300" />
        </button>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {interview.finalized ? (
            <span className="flex items-center gap-1 px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white rounded-full text-xs font-medium">
              <CheckCircle className="w-3 h-3" />
              Completed
            </span>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500/90 backdrop-blur-sm text-white rounded-full text-xs font-medium">
              <Clock className="w-3 h-3" />
              In Progress
            </span>
          )}
        </div>

        {/* Content */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="font-bold text-xl mb-1 drop-shadow-lg">
            {interview.role || 'General Interview'}
          </h3>
          <p className="text-sm opacity-90 capitalize drop-shadow">
            {interview.type} Interview
          </p>
        </div>
      </div>

      <CardContent className="pt-4 pb-3">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Difficulty</p>
              <p className="font-medium capitalize">{interview.level || 'Intermediate'}</p>
            </div>
          </div>

          {interview.techstack && interview.techstack.length > 0 && (
            <div className="flex items-start text-sm">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center mr-3 flex-shrink-0">
                <Code className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Tech Stack</p>
                <div className="flex flex-wrap gap-1">
                  {interview.techstack.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  {interview.techstack.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                      +{interview.techstack.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-500 pt-2 border-t">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatRelativeTime(interview.createdAt)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-3 pb-4 bg-gray-50">
        <Link
          to={`/interview/${interview.id}`}
          className="w-full text-center py-3 px-4 bg-gradient-to-r from-primary to-primary-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
        >
          {interview.finalized ? 'View Feedback' : 'Continue Interview'}
        </Link>
      </CardFooter>
    </Card>
  );
};

export default InterviewCard;
