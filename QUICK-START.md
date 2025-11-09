# Quick Start Guide

**For Non-Technical Users** - Simple step-by-step instructions to get your Job Scorecard Tool running!

## What You Need (One-Time Setup)

### 1. Get an OpenAI API Key

1. Go to [https://platform.openai.com/signup](https://platform.openai.com/signup)
2. Create an account (use your email)
3. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. **IMPORTANT**: Copy the key and save it somewhere safe (you won't see it again!)
6. Add a payment method (OpenAI charges ~$0.01 per job analysis)

### 2. Install Node.js (If Not Already Installed)

1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the "LTS" version (recommended for most users)
3. Run the installer
4. Click "Next" through all the steps (use default settings)
5. Restart your computer

## First-Time Setup (Takes 5-10 minutes)

### Step 1: Open Command Prompt

1. Press `Windows Key + R`
2. Type `cmd` and press Enter
3. A black window will open - this is your terminal

### Step 2: Install Backend

Copy and paste these commands one at a time:

```
cd C:\Projects\job-scorecard-tool\backend
npm install
```

Wait for it to finish (you'll see lots of text scrolling - this is normal!)

### Step 3: Add Your API Key

1. Go to `C:\Projects\job-scorecard-tool\backend` folder
2. Find the file named `.env.example`
3. Make a copy of it and rename to `.env` (remove the .example part)
4. Open `.env` with Notepad
5. Replace `your_openai_api_key_here` with your actual API key
6. Save and close

Your `.env` should look like this:
```
OPENAI_API_KEY=sk-proj-abc123...your-actual-key
PORT=3001
```

### Step 4: Install Frontend

In the same Command Prompt window, run:

```
cd C:\Projects\job-scorecard-tool\frontend
npm install
```

Wait for it to finish.

**Congratulations!** Setup is complete. You only need to do this once.

## Running the Application (Every Time You Want to Use It)

### Step 1: Start the Backend

1. Open Command Prompt
2. Run these commands:

```
cd C:\Projects\job-scorecard-tool\backend
npm start
```

You should see: "🚀 Job Scorecard API server running on port 3001"

**Leave this window open** - don't close it!

### Step 2: Start the Frontend (in a new window)

1. Open a **NEW** Command Prompt window (Windows Key + R, type `cmd`, press Enter)
2. Run these commands:

```
cd C:\Projects\job-scorecard-tool\frontend
npm start
```

Your browser will automatically open to the application!

### Step 3: Use the Tool

1. **Upload or Enter URL**: Choose a PDF file or paste a job posting URL
2. **Click "Analyze"**: Wait 10-30 seconds for AI to process
3. **Edit Requirements**: Review and adjust the AI's suggestions
   - Change requirement text
   - Adjust weights (should total 100%)
   - Add or remove items
4. **Use Scorecard**:
   - Enter candidate name
   - Click "Show Scoring Interface"
   - Score each requirement (0-10)
   - See total score automatically calculated
5. **Print**: Click "Print / Save as PDF" to save for your team

## Stopping the Application

When you're done:
1. Close your browser
2. Go to each Command Prompt window
3. Press `Ctrl + C`
4. Close the windows

## Common Issues & Solutions

### "npm is not recognized"
**Problem**: Node.js not installed properly
**Solution**: Reinstall Node.js and restart your computer

### "API key error"
**Problem**: API key not set correctly
**Solution**:
- Check `.env` file in backend folder
- Make sure there are no extra spaces
- Make sure file is named `.env` not `.env.txt`

### "Port 3001 already in use"
**Problem**: Backend already running or another app is using that port
**Solution**: Close all Command Prompt windows and start fresh

### Browser doesn't open
**Solution**: Manually go to [http://localhost:3000](http://localhost:3000)

### Can't find .env file
**Problem**: Windows might be hiding file extensions
**Solution**:
1. Open File Explorer
2. Click "View" tab
3. Check "File name extensions"
4. Now you can see the full filename

## Need Help?

1. Read the full `README.md` file for more details
2. Check that both Command Prompt windows are still running
3. Try closing everything and starting over
4. Make sure your OpenAI API key is valid and has credits

## Tips for Success

- Always start backend BEFORE frontend
- Keep both Command Prompt windows open while using the app
- Don't click in the Command Prompt window (it can pause the program)
- If something seems stuck, press Enter in the Command Prompt window
- Check your OpenAI account has available credits

---

**That's it!** You now have a working AI-powered scorecard generator for your recruiting team.
