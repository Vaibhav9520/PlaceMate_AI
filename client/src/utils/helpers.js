import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// Format date
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return dayjs(date).format('MMM DD, YYYY');
};

// Format relative time
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  return dayjs(date).fromNow();
};

// Format duration
export const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Calculate profile completion
export const calculateProfileCompletion = (user) => {
  if (!user) return 0;
  
  const fields = [
    'name',
    'email',
    'contactNumber',
    'collegeName',
    'degree',
    'branch',
    'yearOfStudy',
    'cvURL'
  ];
  
  const completedFields = fields.filter(field => user[field] && user[field] !== '');
  return Math.round((completedFields.length / fields.length) * 100);
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Generate random ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Check if file is PDF
export const isPDF = (file) => {
  return file && file.type === 'application/pdf';
};

// Get score message
export const getScoreMessage = (score) => {
  if (score >= 90) return 'Excellent! Outstanding performance!';
  if (score >= 80) return 'Great job! You did very well!';
  if (score >= 70) return 'Good work! Keep it up!';
  if (score >= 60) return 'Not bad! Room for improvement.';
  if (score >= 50) return 'Fair performance. Practice more!';
  return 'Needs improvement. Keep practicing!';
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

// Download as JSON
export const downloadJSON = (data, filename) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

// Sort array by key
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (order === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    }
    return a[key] < b[key] ? 1 : -1;
  });
};

// Calculate average
export const calculateAverage = (numbers) => {
  if (!numbers || numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return Math.round(sum / numbers.length);
};

// Get percentage
export const getPercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};
