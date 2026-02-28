# 🚀 Start Using DSA Coding Practice

## Quick Start

### 1. Restart the Server
```bash
restart-server-now.bat
```

Wait for:
```
Server running in development mode on port 5000
```

### 2. Start the Client (if not running)
```bash
cd client
npm run dev
```

### 3. Access the Feature
1. Open http://localhost:5173
2. Login to your account
3. Go to Dashboard
4. Click **"DSA Coding Practice"** (third card in Quick Actions)

## How to Use

### Step 1: Select Topic
- Choose from 15 DSA topics (Arrays, Strings, Trees, etc.)
- Select number of questions (1, 3, 5, or 10)
- Click "Generate Questions"

### Step 2: Solve Problems
- Read the problem description
- Check examples and constraints
- Write your solution in the code editor
- Select your preferred language (Python, JavaScript, Java, C++, C)

### Step 3: Run & Test
- Click "Run Code" button
- See test results (✓ Passed / ✗ Failed)
- View output and error messages
- Fix your code and run again

### Step 4: Navigate
- Click "Next Question" to move forward
- Click "Previous" to go back
- Track your progress (Question X of Y)

## Supported Languages

1. **Python 3.10.0** - Most popular for DSA
2. **JavaScript (Node.js 18)** - Web development
3. **Java 15.0.2** - Enterprise standard
4. **C++ 10.2.0** - Performance critical
5. **C 10.2.0** - System programming

## Features

✅ AI-generated questions using Gemini
✅ Real-time code execution
✅ Sample test cases (visible)
✅ Hidden test cases (validation)
✅ Syntax highlighting
✅ Code templates for each language
✅ Detailed error messages
✅ Progress tracking

## Example Workflow

1. **Select "Arrays" topic, 3 questions**
2. **AI generates:**
   - Two Sum (Easy)
   - Maximum Subarray (Medium)
   - Trapping Rain Water (Hard)
3. **Solve first question:**
   ```python
   def twoSum(nums, target):
       seen = {}
       for i, num in enumerate(nums):
           if target - num in seen:
               return [seen[target - num], i]
           seen[num] = i
   ```
4. **Run code** - All tests pass! ✓
5. **Move to next question**

## Tips

### For Best Results:
- Read the problem carefully
- Check all examples
- Consider edge cases
- Test with sample inputs first
- Optimize after getting it working

### Language Selection:
- **Python** - Clean syntax, great for interviews
- **JavaScript** - If you're a web developer
- **Java** - If you prefer strong typing
- **C++** - For performance optimization
- **C** - For low-level understanding

### Test Cases:
- Sample test cases are visible
- Hidden test cases validate edge cases
- All must pass for full credit
- Check output format carefully

## Troubleshooting

### Questions Not Generating?
- Check server logs
- Verify Gemini API key in `server/.env`
- Fallback questions will be used if AI fails

### Code Not Running?
- Check syntax errors
- Verify language selection
- Look at error messages
- Try with simple code first

### UI Issues?
- Refresh the page
- Check browser console (F12)
- Clear browser cache
- Restart client

## What's Changed

### Dashboard
- **Before:** "View All Interviews" (third Quick Action)
- **After:** "DSA Coding Practice" with purple icon

### New Page
- Route: `/coding-practice`
- Full-screen coding interface
- Split-screen layout
- Professional code editor

### Backend
- New API endpoints for questions and execution
- Gemini AI integration
- Judge0 compiler integration (optional)

## Configuration

### Required (Already Set):
```
GOOGLE_GENERATIVE_AI_API_KEY=your_key
```

### Optional (For Real Code Execution):
```
RAPIDAPI_KEY=your_rapidapi_key
```

Without RapidAPI key:
- Questions still generate
- Code execution is simulated
- UI works perfectly
- Great for testing

With RapidAPI key:
- Real code execution
- Actual test case validation
- Production-ready

Get free key: https://rapidapi.com/judge0-official/api/judge0-ce

## File Structure

```
client/src/pages/
  └── CodingPractice.jsx    # Main coding page

server/
  ├── controllers/
  │   └── codingController.js    # API handlers
  ├── services/
  │   └── codingService.js       # AI & execution logic
  └── routes/
      └── codingRoutes.js        # API routes
```

## API Endpoints

```
POST /api/coding/generate-questions
POST /api/coding/run
POST /api/coding/submit
```

All require authentication (Bearer token).

## Ready to Code!

1. Make sure server is running
2. Make sure client is running
3. Login to your account
4. Click "DSA Coding Practice"
5. Select a topic
6. Start solving!

---

**Happy Coding! 🎉**

Practice makes perfect. Solve problems daily to improve your DSA skills!
