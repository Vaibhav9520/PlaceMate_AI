# PlaceMate AI - Complete Application Flow

## 🎯 User Journey

### 1. Authentication Flow
```
Landing Page (/)
    ↓
Sign Up (/signup) → Create Account
    ↓
Sign In (/signin) → Login with Credentials
    ↓
Dashboard (/dashboard)
```

### 2. Profile Setup Flow
```
Dashboard
    ↓
Profile (/profile) → Edit Personal Info
    ↓
CV Upload (/cv-upload) → Upload Resume
    ↓
AI Analysis → Extract Skills
    ↓
Profile Complete → Ready for Interviews
```

### 3. Quick Interview Flow
```
Dashboard
    ↓
Start Quick Interview (/interview)
    ↓
Configure Interview:
    - Select Job Role
    - Choose Difficulty Level
    - Pick Tech Stack (optional)
    ↓
Generate Questions (10 questions)
    ↓
Interview Session (/interview/:id)
    ↓
VAPI Voice Interview:
    - AI asks questions
    - User responds verbally
    - Real-time transcript
    - Progress tracking
    ↓
Interview Complete
    ↓
Generate Feedback (AI Analysis)
    ↓
View Feedback (/feedback/:id)
    ↓
Review Scores & Suggestions
```

### 4. Personalized Interview Flow
```
Dashboard
    ↓
Start Personalized Interview (/personalized-interview)
    ↓
Check CV Status:
    - ✅ CV Uploaded → Continue
    - ❌ No CV → Redirect to Upload
    ↓
Configure Interview:
    - Select Target Role
    - Choose Difficulty
    - Focus Tech Stack
    - Question Count (5-20)
    ↓
AI Generates Personalized Questions
    (Based on CV, Skills, Experience)
    ↓
Interview Session (/interview/:id)
    ↓
VAPI Voice Interview
    ↓
Feedback & Analysis
```

### 5. System Status Flow
```
Dashboard
    ↓
System Status (/system-status)
    ↓
View Complete Profile:
    - Personal Information
    - Education Details
    - Skills & Achievements
    - Interview Statistics
    - Recent Interviews
```

## 📱 Page Breakdown

### Landing Page (/)
**Purpose**: Welcome and introduction
- Hero section with app description
- Features showcase
- Call-to-action buttons
- Navigation to Sign Up/Sign In

### Sign Up (/signup)
**Purpose**: User registration
- Name, Email, Password fields
- Form validation
- Create account button
- Link to Sign In

### Sign In (/signin)
**Purpose**: User authentication
- Email, Password fields
- Login button
- Link to Sign Up
- JWT token generation

### Dashboard (/dashboard)
**Purpose**: Main hub after login
**Features**:
- Welcome message with user name
- Statistics cards:
  - Total Interviews
  - Average Score
  - Profile Completion
  - Last Interview Date
- Quick action buttons:
  - Start Quick Interview
  - Personalized Interview
  - Upload CV
- Recent interviews grid with cards
- Navigation to all features

### Interview Setup (/interview)
**Purpose**: Configure quick interview
**Features**:
- Job role dropdown (15+ roles)
- Difficulty level cards (3 levels)
- Tech stack multi-select (30+ technologies)
- Question generation
- Start interview button
- Back to dashboard

### Personalized Interview (/personalized-interview)
**Purpose**: CV-based interview setup
**Features**:
- CV status check
- Target role selection
- Difficulty level
- Focus tech stack
- Question count selector
- Personalized question generation
- Create interview button

### Interview Session (/interview/:id)
**Purpose**: Conduct voice interview
**Features**:
- Interview details header
- VAPI Voice Interview component:
  - Start/End call buttons
  - Mute/Unmute controls
  - Timer display
  - Question progress (1/10)
  - Current question display
  - Live transcript
  - Instructions panel
- Automatic feedback generation on completion

### Feedback (/feedback/:id)
**Purpose**: Display interview results
**Features**:
- Overall score with gradient header
- Score breakdown cards:
  - Communication Score
  - Technical Score
  - Confidence Score
- Strengths list (green checkmarks)
- Weaknesses list (red alerts)
- Detailed analysis paragraph
- Improvement suggestions (numbered)
- Category breakdown (progress bars)
- Download feedback button
- Start another interview button

### Profile (/profile)
**Purpose**: Manage user profile
**Features**:
- Profile header with avatar
- Profile completion percentage
- Edit mode toggle
- Personal information:
  - Name, Email, Contact
- Education information:
  - College, Degree, Branch, Year
- CV upload status
- Interview statistics
- Save/Cancel buttons

### CV Upload (/cv-upload)
**Purpose**: Upload and analyze resume
**Features**:
- Drag & drop area
- File browser
- PDF validation
- File size check (5MB max)
- Upload progress
- AI analysis trigger
- Feature cards explaining benefits
- Back to profile

### System Status (/system-status)
**Purpose**: Complete user overview
**Features**:
- Profile overview card
- Statistics grid (4 cards)
- Personal information table
- Skills tags display
- Achievement badges
- Recent interviews list
- Edit profile button
- Navigation links

## 🔄 Data Flow

### Interview Creation
```
User Input → Frontend Form
    ↓
API Request → POST /api/interviews/create
    ↓
Server Controller → interviewController.js
    ↓
Generate Questions → Based on role/level/tech
    ↓
Save to Database → interviews.json
    ↓
Return Interview ID
    ↓
Navigate to Interview Session
```

### Voice Interview
```
Interview Session Page
    ↓
Initialize VAPI → new Vapi(token)
    ↓
Start Call → vapi.start(config)
    ↓
AI Interviewer Speaks → First question
    ↓
User Responds → Voice captured
    ↓
Transcript Updated → Real-time display
    ↓
Next Question → Automatic progression
    ↓
Interview Complete → vapi.stop()
    ↓
Collect Transcript → Extract answers
    ↓
Generate Feedback
```

### Feedback Generation
```
Interview Complete
    ↓
Extract Answers → From transcript
    ↓
API Request → POST /api/feedback/generate
    ↓
Server Controller → feedbackController.js
    ↓
AI Service → generateDetailedFeedback()
    ↓
Analyze Responses:
    - Communication quality
    - Technical accuracy
    - Confidence level
    - Strengths/Weaknesses
    ↓
Calculate Scores
    ↓
Generate Suggestions
    ↓
Save to Database → feedback.json
    ↓
Update User Stats
    ↓
Return Feedback ID
    ↓
Navigate to Feedback Page
```

### CV Upload & Analysis
```
User Selects PDF
    ↓
Validate File → PDF, <5MB
    ↓
Create FormData
    ↓
API Request → POST /api/users/upload-cv
    ↓
Server Controller → userController.js
    ↓
Save File → server/uploads/
    ↓
AI Analysis → Extract skills, experience
    ↓
Update User Profile
    ↓
Return CV URL & Analysis
    ↓
Update Frontend State
    ↓
Navigate to Profile
```

## 🎨 UI Components

### Reusable Components
- **Button**: Primary, secondary, outline variants
- **Card**: Default, hover, gradient variants
- **InterviewCard**: Display interview with cover image
- **VoiceInterview**: Complete VAPI integration

### Icons Used (lucide-react)
- ArrowLeft, ArrowRight
- User, Mail, Phone
- Briefcase, Target, Code
- Calendar, Clock
- FileText, Upload, Download
- CheckCircle, XCircle, AlertCircle
- Mic, MicOff, Phone, PhoneOff
- Volume2, VolumeX
- TrendingUp, Award
- GraduationCap, Building
- Edit2, Save, X

### Color Scheme
- Primary: Blue gradient
- Success: Green
- Warning: Yellow
- Error: Red
- Info: Blue
- Neutral: Gray scale

## 🔐 Protected Routes

All routes except Landing, SignIn, SignUp require authentication:
- Dashboard
- Interview pages
- Profile pages
- Feedback pages
- System Status

## 📊 State Management

### AuthContext
- User data
- Authentication status
- Login/Logout functions
- Update user function

### Local State (per page)
- Form data
- Loading states
- Error states
- Interview data
- Feedback data

## 🚀 API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Users
- GET /api/users/profile
- PUT /api/users/profile
- POST /api/users/upload-cv
- GET /api/users/stats

### Interviews
- POST /api/interviews/create
- POST /api/interviews/personalized
- GET /api/interviews/:id
- GET /api/interviews/user/:userId
- PUT /api/interviews/:id/finalize

### Feedback
- POST /api/feedback/generate
- GET /api/feedback/:id
- GET /api/feedback/interview/:interviewId

## 📝 Summary

The application provides a complete interview preparation platform with:
- ✅ Voice-based AI interviews using VAPI
- ✅ Personalized questions based on CV
- ✅ Detailed feedback and scoring
- ✅ Profile management
- ✅ Progress tracking
- ✅ Achievement system
- ✅ Beautiful, modern UI
- ✅ Responsive design
- ✅ Secure authentication

**Total Pages**: 10
**Total Components**: 15+
**Total API Endpoints**: 12
**Status**: Fully Functional ✅
