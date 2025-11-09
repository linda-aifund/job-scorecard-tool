# Job Scorecard Tool

An AI-powered web application that automatically generates candidate evaluation scorecards from job descriptions. Simply upload a PDF or provide a URL, and the tool will extract requirements, suggest weightings, and create a customizable scorecard for your recruiting panel.

## Features

- **PDF & URL Support**: Upload job description PDFs or provide URLs to job postings
- **AI-Powered Analysis**: Uses OpenAI GPT to intelligently extract must-have and nice-to-have requirements
- **Automatic Weighting**: AI suggests importance weights that sum to 100%
- **Easy Customization**: Edit requirements, adjust weights, add/remove items
- **Category Organization**: Requirements grouped by Technical Skills, Experience, Education, etc.
- **Candidate Scoring**: Score candidates (0-10) with automatic weighted score calculation
- **Print-Friendly**: Export scorecards as PDF for recruiting panels
- **Clean Interface**: Simple, intuitive design for non-technical users

## Prerequisites

Before you begin, make sure you have:

1. **Node.js** (version 14 or higher) - [Download here](https://nodejs.org/)
2. **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)
   - Sign up for an OpenAI account
   - Navigate to API Keys section
   - Create a new API key and save it securely

## Installation & Setup

### Step 1: Install Backend Dependencies

Open your terminal (Command Prompt or PowerShell on Windows) and navigate to the backend folder:

```bash
cd C:/Projects/job-scorecard-tool/backend
npm install
```

This will install all required packages for the backend server.

### Step 2: Install Frontend Dependencies

Navigate to the frontend folder:

```bash
cd C:/Projects/job-scorecard-tool/frontend
npm install
```

This will install React and all frontend dependencies.

### Step 3: Configure Environment Variables

1. In the `backend` folder, create a file named `.env` (copy from `.env.example`)
2. Open `.env` in a text editor
3. Add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-actual-api-key-here
PORT=3001
```

**IMPORTANT**: Keep your API key secure and never share it publicly!

## Running the Application Locally

### Start the Backend Server

Open a terminal and run:

```bash
cd C:/Projects/job-scorecard-tool/backend
npm start
```

You should see: "🚀 Job Scorecard API server running on port 3001"

### Start the Frontend (in a separate terminal)

Open a **NEW** terminal window and run:

```bash
cd C:/Projects/job-scorecard-tool/frontend
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

## Using the Application

### 1. Upload Job Description

- Choose between PDF upload or URL input
- Click "Analyze Job Description"
- Wait for AI to process (typically 10-30 seconds)

### 2. Edit Requirements

- Review AI-extracted requirements
- Edit requirement text
- Adjust weights (must total 100%)
- Use "Auto-Normalize" button to automatically distribute weights
- Add/remove requirements as needed
- Edit nice-to-have items

### 3. View & Use Scorecard

- Enter candidate name
- Click "Show Scoring Interface"
- Score each requirement (0-10)
- View calculated total score
- Click "Print / Save as PDF" to export

## Deploying Online (For Your Team)

### Option A: Deploy to Vercel (Recommended - Free & Easy)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project root**:
   ```bash
   cd C:/Projects/job-scorecard-tool
   vercel
   ```

4. **Set Environment Variables**:
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add `OPENAI_API_KEY` with your API key

5. **Deploy to production**:
   ```bash
   vercel --prod
   ```

Your team can now access the tool at the provided Vercel URL!

### Option B: Deploy to Render

1. Create account at [render.com](https://render.com)
2. Create new "Web Service"
3. Connect your GitHub repository (you'll need to push code to GitHub first)
4. Configure:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
5. Add environment variable `OPENAI_API_KEY`
6. Create separate "Static Site" for frontend

## Project Structure

```
job-scorecard-tool/
├── backend/              # Express API server
│   ├── server.js        # Main server file
│   ├── package.json     # Backend dependencies
│   └── .env            # Environment variables (API keys)
├── frontend/            # React application
│   ├── public/         # Static files
│   ├── src/            # React components
│   │   ├── App.js     # Main app component
│   │   ├── components/ # UI components
│   │   │   ├── ScorecardUpload.js
│   │   │   ├── ScorecardEditor.js
│   │   │   └── ScorecardView.js
│   │   └── App.css    # Styles
│   └── package.json   # Frontend dependencies
└── README.md          # This file
```

## Troubleshooting

### "Cannot find module" errors
**Solution**: Make sure you ran `npm install` in both backend and frontend folders

### API key errors
**Solution**:
- Check `.env` file exists in backend folder
- Verify API key is correct (starts with `sk-`)
- Make sure there are no spaces or quotes around the key

### Port already in use
**Solution**:
- Close other applications using port 3001 or 3000
- Or change the PORT in backend/.env to another number

### PDF not extracting text
**Solution**:
- Ensure PDF is not image-based (scanned document)
- Try using URL method instead
- Check PDF is not password-protected

### Frontend can't connect to backend
**Solution**:
- Make sure backend server is running (check terminal)
- Verify backend is running on port 3001
- Check no firewall is blocking local connections

## Cost Estimation

OpenAI API costs (as of 2024):
- GPT-4o-mini: ~$0.01-0.02 per job description analysis
- Estimated cost: $1-2 per 100 job descriptions

## Security Notes

- Never commit `.env` file to version control
- Keep your OpenAI API key secure
- Consider adding authentication for production use
- Monitor API usage in OpenAI dashboard

## Future Enhancements

Potential features to add:
- User authentication (login system)
- Save scorecards to database
- Compare multiple candidates side-by-side
- Export to Excel/CSV
- Custom scoring rubrics
- Team collaboration features

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review OpenAI API documentation
3. Check Node.js and npm are properly installed

## License

This project is provided as-is for internal use.

---

Built with React, Node.js, Express, and OpenAI GPT
