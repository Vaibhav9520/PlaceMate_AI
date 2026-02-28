# DSA Coding Practice Feature

## Overview
Replaced "View All Interviews" with a comprehensive DSA Coding Practice platform that includes:
- AI-generated coding questions using Gemini API
- Online compiler supporting multiple languages
- Test case validation (sample + hidden)
- Real-time code execution

## Features

### 1. Topic Selection
- 15 DSA topics: Arrays, Strings, Linked Lists, Stacks, Queues, Trees, Graphs, Sorting, Searching, Dynamic Programming, Recursion, Backtracking, Greedy, Hash Tables, Heaps
- Choose number of questions (1, 3, 5, or 10)
- AI generates questions using Gemini API

### 2. Question Generation
- Uses Google Gemini AI to generate unique problems
- Each question includes:
  - Clear title and description
  - Difficulty level (Easy/Medium/Hard)
  - Example test cases with explanations
  - Constraints
  - Sample test cases (visible)
  - Hidden test cases (for validation)

### 3. Online Compiler
- Supports 5 programming languages:
  - Python 3.10.0
  - JavaScript (Node.js 18)
  - Java 15.0.2
  - C++ 10.2.0
  - C 10.2.0
- Code templates for each language
- Syntax highlighting
- Real-time code editing

### 4. Test Case Validation
- Run code against sample test cases
- Hidden test cases for thorough validation
- Visual feedback (✓ Passed / ✗ Failed)
- Detailed output for each test case

### 5. Navigation
- Previous/Next question buttons
- Progress tracking (Question X of Y)
- Return to topic selection anytime

## Files Created

### Frontend
- `client/src/pages/CodingPractice.jsx` - Main coding practice page
  - Topic selection screen
  - Code editor interface
  - Test results display
  - Question navigation

### Backend
- `server/controllers/codingController.js` - API controllers
  - `generateQuestions` - Generate DSA questions
  - `runCode` - Execute code with test cases
  - `submitSolution` - Save user submissions

- `server/services/codingService.js` - Core logic
  - `generateDSAQuestions` - AI question generation
  - `runCodeWithTests` - Code execution engine
  - Fallback questions if AI fails

- `server/routes/codingRoutes.js` - API routes
  - POST `/api/coding/generate-questions`
  - POST `/api/coding/run`
  - POST `/api/coding/submit`

### Updates
- `client/src/App.jsx` - Added `/coding-practice` route
- `client/src/pages/Dashboard.jsx` - Replaced "View All Interviews" with "DSA Coding Practice"
- `server/server.js` - Added coding routes

## API Endpoints

### 1. Generate Questions
```
POST /api/coding/generate-questions
Authorization: Bearer <token>

Request:
{
  "topic": "Arrays",
  "count": 3
}

Response:
{
  "success": true,
  "questions": [...],
  "count": 3
}
```

### 2. Run Code
```
POST /api/coding/run
Authorization: Bearer <token>

Request:
{
  "code": "def solution():\n    pass",
  "language": "python",
  "questionId": "arrays-123",
  "testCases": [...]
}

Response:
{
  "success": true,
  "output": "Test results...",
  "testResults": [...],
  "executionTime": "0.1s"
}
```

### 3. Submit Solution
```
POST /api/coding/submit
Authorization: Bearer <token>

Request:
{
  "code": "def solution():\n    pass",
  "language": "python",
  "questionId": "arrays-123"
}

Response:
{
  "success": true,
  "message": "Solution submitted successfully"
}
```

## Code Execution

### Judge0 API Integration
The feature uses Judge0 CE (Community Edition) for code execution:
- Supports 50+ programming languages
- Secure sandboxed execution
- Real-time compilation and execution
- Memory and time limits

### Configuration
Add to `server/.env`:
```
RAPIDAPI_KEY=your_rapidapi_key_here
```

Get your free API key from:
https://rapidapi.com/judge0-official/api/judge0-ce

### Fallback Mode
If Judge0 API is not configured, the system:
- Still generates questions
- Simulates code execution
- Shows "Code execution simulated" message
- Allows testing the UI without API key

## Usage Flow

1. **User clicks "DSA Coding Practice"** on Dashboard
2. **Selects topic** (e.g., "Arrays")
3. **Chooses question count** (e.g., 3 questions)
4. **Clicks "Generate Questions"**
5. **AI generates questions** using Gemini
6. **User sees first question** with:
   - Problem description
   - Examples
   - Constraints
   - Code editor
7. **User writes code** in preferred language
8. **Clicks "Run Code"**
9. **System executes code** against test cases
10. **Shows results** (passed/failed for each test)
11. **User navigates** to next question or previous
12. **Repeats** until all questions completed

## Question Structure

```javascript
{
  "id": "arrays-1234567890-0",
  "title": "Two Sum",
  "difficulty": "Easy",
  "description": "Given an array of integers...",
  "examples": [
    {
      "input": "nums = [2,7,11,15], target = 9",
      "output": "[0,1]",
      "explanation": "Because nums[0] + nums[1] == 9"
    }
  ],
  "constraints": [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9"
  ],
  "testCases": [
    {
      "input": "[2,7,11,15]\n9",
      "expectedOutput": "[0,1]",
      "hidden": false
    },
    {
      "input": "[3,2,4]\n6",
      "expectedOutput": "[1,2]",
      "hidden": true
    }
  ]
}
```

## UI Components

### Topic Selection Screen
- Clean card-based layout
- Dropdown for topic selection
- Dropdown for question count
- "Generate Questions" button
- Back to Dashboard link

### Coding Interface
- Split-screen layout:
  - Left: Problem description
  - Right: Code editor + output
- Top bar with:
  - Topic and progress
  - Language selector
  - Run Code button
- Bottom navigation:
  - Previous/Next buttons
  - Question counter

### Test Results Display
- Visual indicators (✓/✗)
- Test case details
- Expected vs actual output
- Hidden test case status

## Styling

- Consistent with PlaceMate AI design
- Primary color: Purple (#667eea)
- Gradient backgrounds
- Smooth transitions
- Responsive layout
- Clean typography

## Future Enhancements

1. **Save Progress**
   - Store user solutions
   - Track completion status
   - Resume from last question

2. **Leaderboard**
   - Compare with other users
   - Time-based rankings
   - Accuracy scores

3. **Hints System**
   - AI-generated hints
   - Progressive hint levels
   - Penalty for using hints

4. **Video Solutions**
   - AI-generated explanations
   - Step-by-step walkthroughs
   - Multiple approaches

5. **Contest Mode**
   - Timed challenges
   - Multiple questions
   - Scoring system

6. **Code Review**
   - AI analyzes code quality
   - Suggests optimizations
   - Time/space complexity analysis

## Testing

### Test Question Generation
```bash
# Start server
cd server
npm run dev

# In another terminal, test the endpoint
curl -X POST http://localhost:5000/api/coding/generate-questions \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"topic":"Arrays","count":3}'
```

### Test Code Execution
```bash
curl -X POST http://localhost:5000/api/coding/run \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "code":"print(\"Hello World\")",
    "language":"python",
    "testCases":[]
  }'
```

## Troubleshooting

### Questions Not Generating
- Check Gemini API key in `server/.env`
- Verify `GOOGLE_GENERATIVE_AI_API_KEY` is set
- Check server logs for errors
- Fallback questions will be used if AI fails

### Code Not Running
- Check Judge0 API key in `server/.env`
- Verify `RAPIDAPI_KEY` is set
- System will show "simulated" message without API key
- Check language ID mapping in `codingService.js`

### UI Not Loading
- Check if route is added in `App.jsx`
- Verify component import
- Check browser console for errors
- Ensure server is running

## Environment Variables

Add to `server/.env`:
```
# Existing
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key

# New (optional)
RAPIDAPI_KEY=your_rapidapi_key
```

## Dependencies

No new dependencies required! Uses existing:
- `@google/generative-ai` - Question generation
- `axios` - API calls
- `lucide-react` - Icons
- `sonner` - Toast notifications

## Summary

✅ Replaced "View All Interviews" with "DSA Coding Practice"
✅ AI-powered question generation using Gemini
✅ Online compiler with 5 languages
✅ Test case validation (sample + hidden)
✅ Clean, intuitive UI
✅ Fully integrated with existing auth system
✅ Ready to use!

## Next Steps

1. Start the server: `cd server && npm run dev`
2. Start the client: `cd client && npm run dev`
3. Login to your account
4. Click "DSA Coding Practice" on Dashboard
5. Select a topic and generate questions
6. Start coding!
