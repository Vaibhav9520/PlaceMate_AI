# PlaceMate AI — Interview Preparation Platform

A full-stack web application that helps students and job seekers prepare for technical and HR interviews through AI-powered mock interviews, resume-based question generation, DSA practice, and company-specific question banks.

---

## Features

### Mock Interview (AI Interview Practice)
- Select experience level (Entry / Intermediate / Advanced)
- Choose a target job role from 12+ options (Software Engineer, Frontend, Backend, Full Stack, DevOps, Data Scientist, etc.)
- Pick your tech stack (React, Node.js, Python, Java, MongoDB, Docker, AWS, and more)
- Configure interview type: Mixed (Technical + HR), Technical Only, or HR/Behavioral Only
- Choose number of questions (5, 10, 15, or 20)
- Two interview modes:
  - **Face-to-Face AI** — voice-based interview (coming soon)
  - **Role-Based General** — text-based interview with voice input support

### Resume-Based Interview (Personalized)
- Upload your CV (PDF or DOCX, up to 5MB)
- Automatic skill extraction from resume using `pdf-parse` — detects 150+ tech and non-tech skills
- Skills saved to your profile — no manual entry needed
- Generate interview questions tailored to your extracted skills and target role
- Questions are matched to your experience level and skill set

### Interview Session
- Answer questions one by one with a text area
- Voice input support using Web Speech API
- Read question aloud feature
- Navigation between questions (Previous / Next)
- Progress tracking (X of N answered)
- Answers auto-saved to localStorage

### Interview Feedback
- Overall score with circular progress indicator
- Breakdown scores: Technical, Communication, Confidence
- Strengths and areas for improvement
- Question-by-question analysis with keyword matching
- Improvement suggestions
- Option to retake or go back to dashboard

### DSA Practice (Coding Practice)
- Browse LeetCode-style coding problems
- Filter by difficulty, company, and category
- Direct links to LeetCode problems
- 500+ companies covered with real interview questions

### Company Questions
- Browse questions by company (500+ companies)
- Filter by recency: All time, Last 6 months, Last 3 months, Last 30 days
- Question metadata: difficulty, frequency, acceptance rate, tags

### Profile
- View and edit personal information (name, contact, college, degree, branch, year)
- Profile completion percentage
- CV upload and skill display
- Interview statistics (total interviews, average score, skills identified)

### Dashboard
- Welcome section with quick practice shortcut
- Progress stats (total interviews, average score)
- Activity overview heatmap (GitHub-style, year selector)
- Practice module cards linking to all features
- Recent interviews list with scores and delete option

### Authentication
- Register with full profile details
- JWT-based login/logout
- Protected routes — all app pages require authentication
- Persistent sessions via localStorage token

### Theme
- Dark and light mode toggle
- Consistent design system across all pages
- Indigo/violet accent colors, `#080B14` dark background

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| React Router v7 | Client-side routing |
| Tailwind CSS v3 | Styling |
| Vite | Build tool and dev server |
| Axios | HTTP client |
| Lucide React | Icons |
| Sonner | Toast notifications |
| Day.js | Date formatting |
| clsx + tailwind-merge | Conditional class utilities |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password hashing |
| Multer | CV file upload handling |
| pdf-parse | PDF text extraction for skill parsing |
| express-validator | Input validation |
| dotenv | Environment variable management |
| cors | Cross-origin resource sharing |

---

## Project Structure

```
PLACEMATE_REACT/
├── client/                        # React frontend
│   ├── public/                    # Static assets (logo, icons)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.jsx
│   │   │   │   └── Card.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── TopNavbar.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # JWT auth state
│   │   │   └── ThemeContext.jsx   # Dark/light mode
│   │   ├── data/
│   │   │   ├── companies/         # Chunked company question data
│   │   │   └── companyQuestions.js
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── SignIn.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── GeneralInterview.jsx
│   │   │   ├── PersonalizedInterview.jsx
│   │   │   ├── InterviewSession.jsx
│   │   │   ├── InterviewFeedback.jsx
│   │   │   ├── FaceToFaceInterview.jsx
│   │   │   ├── CodingPractice.jsx
│   │   │   ├── CompanyQuestions.jsx
│   │   │   ├── UpdateCV.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/
│   │   │   └── api.js             # Axios API calls
│   │   ├── utils/
│   │   │   ├── cn.js              # Tailwind class utility
│   │   │   └── helpers.js         # Profile completion, initials, etc.
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                        # Express backend
    ├── config/
    │   └── db.js                  # MongoDB connection
    ├── controllers/
    │   ├── authController.js
    │   ├── userController.js      # CV upload + skill extraction
    │   ├── interviewController.js
    │   ├── codingController.js
    │   └── feedbackController (via routes)
    ├── middleware/
    │   └── auth.js                # JWT protect middleware
    ├── models_backup/
    │   ├── User.js
    │   ├── Interview.js
    │   ├── Feedback.js
    │   └── CodingQuestion.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── userRoutes.js
    │   ├── interviewRoutes.js
    │   ├── codingRoutes.js
    │   └── feedbackRoutes.js
    ├── services/
    │   └── codingService.js
    ├── uploads/                   # Uploaded CV files
    ├── .env
    ├── package.json
    └── server.js
```

---

## API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Create new account |
| POST | `/login` | Login and receive JWT |
| GET | `/me` | Get current user from token |

### Users — `/api/users`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/profile` | Get user profile |
| PUT | `/profile` | Update profile details |
| POST | `/upload-cv` | Upload CV and extract skills |
| GET | `/stats` | Get user statistics |
| POST | `/generate-interview` | Generate personalized interview |

### Interviews — `/api/interviews`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/create` | Create interview session |
| GET | `/recent` | Get recent interviews |
| GET | `/:id` | Get interview by ID |
| POST | `/generate-role-based` | Generate role-based questions |
| POST | `/generate-personalized` | Generate CV-based questions |
| POST | `/submit` | Submit interview answers |
| PUT | `/:id/finalize` | Finalize interview |
| DELETE | `/:id` | Delete interview |

### Feedback — `/api/feedback`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/generate` | Generate AI feedback for answers |
| GET | `/:interviewId` | Get feedback by interview ID |

### Coding — `/api/coding`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/questions` | Get coding questions |

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key (for AI feedback generation)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/placemate-ai.git
cd placemate-ai
```

### 2. Setup the server
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
USE_MONGODB=true
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the server:
```bash
npm run dev
```

### 3. Setup the client
```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the client:
```bash
npm run dev
```

### 4. Open the app
Visit `http://localhost:5173`

---

## Environment Variables

### Server (`server/.env`)
| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `USE_MONGODB` | Must be `true` |
| `CLIENT_URL` | Frontend URL for CORS |
| `GEMINI_API_KEY` | Google Gemini API key for AI feedback |

### Client (`client/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## Pages and Routes

| Route | Page | Auth Required |
|---|---|---|
| `/` | Landing | No |
| `/sign-in` | Sign In | No |
| `/sign-up` | Sign Up | No |
| `/dashboard` | Dashboard | Yes |
| `/general-interview` | AI Interview Setup | Yes |
| `/personalized-interview` | Resume-Based Interview | Yes |
| `/interview-session` | Interview Session | Yes |
| `/face-to-face-interview` | Face-to-Face (Coming Soon) | Yes |
| `/feedback/:id` | Interview Feedback | Yes |
| `/coding-practice` | DSA Practice | Yes |
| `/company-questions` | Company Questions | Yes |
| `/cv-upload` | Upload Resume | Yes |
| `/profile` | User Profile | Yes |

---

## Author

**Vaibhav Singh**  
B.Tech — Lovely Professional University  
[GitHub](https://github.com/Vaibhav9520) · [LinkedIn](https://www.linkedin.com/in/vaibhav-singh-35073124a/)
