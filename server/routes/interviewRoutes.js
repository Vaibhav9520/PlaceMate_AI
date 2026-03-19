import express from 'express';
import { 
  generatePersonalizedInterview, 
  generateRoleBasedInterview,
  submitInterview, 
  getRecentInterviews,
  deleteInterview
} from '../controllers/interviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Add comprehensive logging middleware
router.use((req, res, next) => {
  console.log('='.repeat(50));
  console.log(`🛣️ INTERVIEW ROUTE: ${req.method} ${req.path}`);
  console.log(`🌐 Full URL: ${req.originalUrl}`);
  console.log(`📍 Base URL: ${req.baseUrl}`);
  console.log(`🔐 Auth Header: ${req.headers.authorization ? 'Present' : 'Missing'}`);
  console.log('='.repeat(50));
  next();
});

// Test routes (no auth required)
router.get('/test', (req, res) => {
  console.log('✅ TEST ROUTE HIT');
  res.status(200).json({ 
    success: true, 
    message: 'Interview routes are working!',
    timestamp: new Date().toISOString()
  });
});

router.get('/health', (req, res) => {
  console.log('🏥 HEALTH CHECK HIT');
  res.status(200).json({ 
    success: true, 
    message: 'Interview routes are healthy!',
    timestamp: new Date().toISOString()
  });
});

// Test recent route without auth for debugging
router.get('/test-recent', (req, res) => {
  console.log('🧪 TEST RECENT ROUTE HIT');
  res.status(200).json({ 
    success: true, 
    message: 'Recent route is accessible',
    interviews: [],
    timestamp: new Date().toISOString()
  });
});

// Test delete route without auth for debugging
router.delete('/test-delete/:id', (req, res) => {
  console.log('🧪 TEST DELETE ROUTE HIT');
  console.log('🆔 Test ID:', req.params.id);
  res.status(200).json({ 
    success: true, 
    message: 'Delete route is accessible',
    id: req.params.id,
    timestamp: new Date().toISOString()
  });
});

// Main routes (auth required)
router.post('/generate-personalized', protect, (req, res, next) => {
  console.log('📝 GENERATE PERSONALIZED ROUTE HIT');
  generatePersonalizedInterview(req, res, next);
});

router.post('/generate-role-based', protect, (req, res, next) => {
  console.log('🎯 GENERATE ROLE-BASED ROUTE HIT');
  generateRoleBasedInterview(req, res, next);
});

router.post('/submit', protect, (req, res, next) => {
  console.log('📤 SUBMIT ROUTE HIT');
  submitInterview(req, res, next);
});

router.get('/recent', protect, (req, res, next) => {
  console.log('📋 RECENT ROUTE HIT - THIS IS THE IMPORTANT ONE');
  getRecentInterviews(req, res, next);
});

// DELETE route - must be before catch-all
router.delete('/:id', protect, (req, res, next) => {
  console.log('🗑️ DELETE INTERVIEW ROUTE HIT');
  console.log('🆔 Interview ID from params:', req.params.id);
  console.log('👤 User from auth:', req.user?._id);
  console.log('🌐 Full request URL:', req.originalUrl);
  console.log('📍 Request path:', req.path);
  deleteInterview(req, res, next);
});

// Catch-all route for debugging - MUST BE LAST
router.all('*', (req, res) => {
  console.log('❌ UNMATCHED ROUTE:', req.method, req.path);
  console.log('🌐 Original URL:', req.originalUrl);
  console.log('Available routes:', ['/test', '/health', '/test-recent', '/generate-personalized', '/submit', '/recent', '/:id (DELETE)']);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found in interviews`,
    availableRoutes: ['/test', '/health', '/test-recent', '/generate-personalized', '/submit', '/recent', '/:id (DELETE)'],
    requestedPath: req.path,
    requestedMethod: req.method,
    originalUrl: req.originalUrl
  });
});

export default router;