// Interview Types
export const INTERVIEW_TYPES = [
  { value: 'quick', label: 'Quick Practice', description: 'Start immediately with general questions' },
  { value: 'personalized', label: 'Personalized', description: 'CV-based customized questions' }
];

// Difficulty Levels
export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Entry Level', description: 'For beginners and fresh graduates' },
  { value: 'intermediate', label: 'Intermediate', description: 'For 1-3 years experience' },
  { value: 'hard', label: 'Advanced', description: 'For senior positions' }
];

// Tech Stack Options
export const TECH_STACK = [
  // Frontend
  { value: 'react', label: 'React', category: 'frontend' },
  { value: 'angular', label: 'Angular', category: 'frontend' },
  { value: 'vue', label: 'Vue.js', category: 'frontend' },
  { value: 'nextjs', label: 'Next.js', category: 'frontend' },
  { value: 'typescript', label: 'TypeScript', category: 'frontend' },
  { value: 'javascript', label: 'JavaScript', category: 'frontend' },
  
  // Backend
  { value: 'nodejs', label: 'Node.js', category: 'backend' },
  { value: 'express', label: 'Express.js', category: 'backend' },
  { value: 'python', label: 'Python', category: 'backend' },
  { value: 'django', label: 'Django', category: 'backend' },
  { value: 'flask', label: 'Flask', category: 'backend' },
  { value: 'java', label: 'Java', category: 'backend' },
  { value: 'spring', label: 'Spring Boot', category: 'backend' },
  { value: 'dotnet', label: '.NET', category: 'backend' },
  
  // Database
  { value: 'mongodb', label: 'MongoDB', category: 'database' },
  { value: 'postgresql', label: 'PostgreSQL', category: 'database' },
  { value: 'mysql', label: 'MySQL', category: 'database' },
  { value: 'redis', label: 'Redis', category: 'database' },
  
  // DevOps
  { value: 'docker', label: 'Docker', category: 'devops' },
  { value: 'kubernetes', label: 'Kubernetes', category: 'devops' },
  { value: 'aws', label: 'AWS', category: 'devops' },
  { value: 'azure', label: 'Azure', category: 'devops' },
  { value: 'gcp', label: 'Google Cloud', category: 'devops' },
  
  // Mobile
  { value: 'react-native', label: 'React Native', category: 'mobile' },
  { value: 'flutter', label: 'Flutter', category: 'mobile' },
  { value: 'swift', label: 'Swift', category: 'mobile' },
  { value: 'kotlin', label: 'Kotlin', category: 'mobile' }
];

// Job Roles
export const JOB_ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'Mobile Developer',
  'QA Engineer',
  'Product Manager',
  'UI/UX Designer',
  'System Architect',
  'Database Administrator',
  'Cloud Engineer',
  'Security Engineer'
];

// Company Covers (for interview cards)
export const COMPANY_COVERS = {
  adobe: '/covers/adobe.png',
  amazon: '/covers/amazon.png',
  facebook: '/covers/facebook.png',
  hostinger: '/covers/hostinger.png',
  pinterest: '/covers/pinterest.png',
  quora: '/covers/quora.png',
  reddit: '/covers/reddit.png',
  skype: '/covers/skype.png',
  spotify: '/covers/spotify.png',
  telegram: '/covers/telegram.png',
  tiktok: '/covers/tiktok.png',
  yahoo: '/covers/yahoo.png'
};

// Get random company cover
export const getRandomCover = () => {
  const covers = Object.values(COMPANY_COVERS);
  return covers[Math.floor(Math.random() * covers.length)];
};

// Achievement Levels
export const ACHIEVEMENTS = [
  { id: 'first-steps', name: 'First Steps', description: 'Complete your first interview', threshold: 1, icon: '🎯' },
  { id: 'getting-better', name: 'Getting Better', description: 'Complete 5 interviews', threshold: 5, icon: '📈' },
  { id: 'interview-pro', name: 'Interview Pro', description: 'Complete 10 interviews', threshold: 10, icon: '🏆' },
  { id: 'master', name: 'Master', description: 'Complete 25 interviews', threshold: 25, icon: '👑' },
  { id: 'legend', name: 'Legend', description: 'Complete 50 interviews', threshold: 50, icon: '⭐' }
];

// Get user achievements
export const getUserAchievements = (totalInterviews) => {
  return ACHIEVEMENTS.filter(achievement => totalInterviews >= achievement.threshold);
};

// Score Colors
export const getScoreColor = (score) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
};

// Score Background Colors
export const getScoreBgColor = (score) => {
  if (score >= 80) return 'bg-green-100';
  if (score >= 60) return 'bg-blue-100';
  if (score >= 40) return 'bg-yellow-100';
  return 'bg-red-100';
};
