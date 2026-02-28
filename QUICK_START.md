# PlaceMate AI - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Start the Application
```bash
# Windows Users
.\start.bat

# Mac/Linux Users
./start.sh
```

### Step 2: Open Your Browser
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Step 3: Create Account & Start Interview
1. Click "Sign Up" and create your account
2. Login with your credentials
3. Go to Dashboard
4. Click "Start Quick Interview"
5. Configure your interview settings
6. Start voice interview with AI!

---

## 📋 Quick Reference

### Main Features
| Feature | URL | Description |
|---------|-----|-------------|
| Dashboard | `/dashboard` | Main hub with stats |
| Quick Interview | `/interview` | Start immediate practice |
| Personalized | `/personalized-interview` | CV-based questions |
| Profile | `/profile` | Manage your profile |
| CV Upload | `/cv-upload` | Upload resume |
| System Status | `/system-status` | View complete stats |

### Interview Flow
```
Dashboard → Interview Setup → Voice Interview → Feedback
```

### Tech Stack Selection
- **Frontend**: React, Angular, Vue, Next.js, TypeScript
- **Backend**: Node.js, Python, Java, .NET
- **Database**: MongoDB, PostgreSQL, MySQL
- **DevOps**: Docker, Kubernetes, AWS, Azure
- **Mobile**: React Native, Flutter

### Difficulty Levels
- **Entry Level**: For beginners
- **Intermediate**: 1-3 years experience
- **Advanced**: Senior positions

---

## 🎯 Common Tasks

### Upload Your CV
1. Go to Profile page
2. Click "Upload CV" button
3. Drag & drop PDF or click to browse
4. Wait for AI analysis
5. Skills automatically extracted!

### Start Quick Interview
1. Dashboard → "Start Quick Interview"
2. Select job role (e.g., Software Engineer)
3. Choose difficulty level
4. Pick tech stack (optional)
5. Click "Start Interview"
6. Talk with AI interviewer!

### View Feedback
1. Complete an interview
2. Automatic redirect to feedback page
3. View scores and analysis
4. Download feedback as JSON
5. Review improvement suggestions

### Edit Profile
1. Go to Profile page
2. Click "Edit Profile"
3. Update information
4. Click "Save Changes"

---

## 🔧 Troubleshooting

### Servers Won't Start
```bash
# Check if ports are in use
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Kill processes if needed
taskkill /PID <process_id> /F
```

### VAPI Not Connecting
- Check VITE_VAPI_WEB_TOKEN in client/.env
- Verify internet connection
- Check browser console for errors

### CV Upload Fails
- Ensure file is PDF format
- Check file size (max 5MB)
- Verify server/uploads/ folder exists

### Login Issues
- Clear browser cache
- Check if backend is running
- Verify credentials

---

## 📱 Mobile Access

The application is responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablets (iPad, Android tablets)
- Mobile phones (iOS, Android)

---

## 🎓 Tips for Best Experience

### Before Interview
1. ✅ Upload your CV first
2. ✅ Complete your profile
3. ✅ Test your microphone
4. ✅ Find a quiet place
5. ✅ Use headphones

### During Interview
1. 🎤 Speak clearly and naturally
2. ⏸️ Wait for AI to finish questions
3. 💡 Take your time to think
4. 🔇 Use mute if needed
5. 📝 Watch the transcript

### After Interview
1. 📊 Review your scores
2. 📖 Read feedback carefully
3. 💪 Note improvement areas
4. 🔄 Practice regularly
5. 📈 Track your progress

---

## 🎯 Interview Preparation Tips

### Technical Questions
- Explain your thought process
- Use specific examples
- Mention technologies used
- Discuss challenges faced
- Highlight solutions implemented

### Behavioral Questions
- Use STAR method (Situation, Task, Action, Result)
- Be specific and concise
- Show learning and growth
- Demonstrate teamwork
- Highlight achievements

### Communication
- Speak at moderate pace
- Use clear language
- Avoid filler words
- Stay confident
- Be authentic

---

## 📊 Understanding Your Scores

### Overall Score (0-100%)
- 90-100%: Excellent
- 80-89%: Very Good
- 70-79%: Good
- 60-69%: Fair
- Below 60%: Needs Improvement

### Communication Score
Measures clarity, articulation, and expression

### Technical Score
Evaluates knowledge and expertise

### Confidence Score
Assesses presentation and poise

---

## 🏆 Achievement System

| Achievement | Requirement | Icon |
|-------------|-------------|------|
| First Steps | 1 interview | 🎯 |
| Getting Better | 5 interviews | 📈 |
| Interview Pro | 10 interviews | 🏆 |
| Master | 25 interviews | 👑 |
| Legend | 50 interviews | ⭐ |

---

## 🔐 Account Security

### Password Requirements
- Minimum 6 characters
- Mix of letters and numbers recommended
- Keep it secure and unique

### Data Privacy
- Your CV is stored securely
- Interview data is private
- No data shared with third parties
- You can delete your account anytime

---

## 📞 Need Help?

### Check These First
1. Read HOW_TO_START.md
2. Review INTEGRATION_COMPLETE.md
3. Check APPLICATION_FLOW.md
4. Look at FINAL_STATUS.md

### Common Questions

**Q: How many interviews can I do?**
A: Unlimited! Practice as much as you want.

**Q: Can I pause an interview?**
A: Use the mute button to pause temporarily.

**Q: How long does an interview take?**
A: Typically 10-15 minutes for 10 questions.

**Q: Can I redo an interview?**
A: Yes! Start a new interview anytime.

**Q: Is my data saved?**
A: Yes, all interviews and feedback are saved.

---

## 🎉 Ready to Start!

You're all set! Start your first interview and improve your skills with AI-powered practice.

**Good luck with your interview preparation! 🚀**

---

## 📚 Additional Resources

- **VAPI Docs**: https://docs.vapi.ai/
- **React Docs**: https://react.dev/
- **Interview Tips**: Check feedback suggestions after each interview

---

**Last Updated**: February 17, 2026
**Version**: 1.0.0
**Status**: ✅ Ready to Use
