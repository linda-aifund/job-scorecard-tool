# Deployment Guide - Host Your Scorecard Tool Online

This guide will help you deploy your Job Scorecard Tool online so your entire team can access it from anywhere.

## Best Options for Deployment

### Option 1: Render (Recommended for Beginners)

**Pros**: Free tier, easy setup, good for small teams
**Cost**: Free (with limitations) or $7/month for better performance

#### Steps:

1. **Push Code to GitHub** (if you haven't already):
   ```bash
   cd C:\Projects\job-scorecard-tool
   git init
   git add .
   git commit -m "Initial commit"
   # Create a repository on GitHub first, then:
   git remote add origin https://github.com/YOUR_USERNAME/job-scorecard-tool.git
   git push -u origin main
   ```

2. **Create Render Account**:
   - Go to [https://render.com](https://render.com)
   - Sign up with GitHub

3. **Deploy Backend**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Settings:
     - **Name**: job-scorecard-backend
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `node server.js`
     - **Environment Variables**: Add `OPENAI_API_KEY` (your API key)
   - Click "Create Web Service"
   - Copy the URL (e.g., https://job-scorecard-backend.onrender.com)

4. **Deploy Frontend**:
   - Click "New +" → "Static Site"
   - Connect same repository
   - Settings:
     - **Name**: job-scorecard-frontend
     - **Root Directory**: `frontend`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `build`
   - In frontend/package.json, update proxy to your backend URL:
     ```json
     "proxy": "https://job-scorecard-backend.onrender.com"
     ```
   - Push changes and redeploy

5. **Share with Team**:
   - Your frontend URL is your app: https://job-scorecard-frontend.onrender.com
   - Share this link with your team!

---

### Option 2: Vercel (Fast & Easy)

**Pros**: Excellent performance, simple deployment, good free tier
**Cost**: Free for small teams

#### Steps:

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```
   Follow the email verification link

3. **Deploy**:
   ```bash
   cd C:\Projects\job-scorecard-tool
   vercel
   ```

   Answer the prompts:
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N**
   - What's your project's name? **job-scorecard-tool**
   - In which directory is your code located? **./backend** (for backend first)

4. **Set Environment Variables**:
   ```bash
   vercel env add OPENAI_API_KEY
   ```
   Paste your API key when prompted

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

6. **Deploy Frontend** (repeat steps 3-5 for frontend directory)

7. **Update Frontend API URL**:
   - In frontend code, update API calls to point to your backend URL
   - Or use Vercel's monorepo setup (more advanced)

---

### Option 3: Railway

**Pros**: Simple, all-in-one solution
**Cost**: $5/month after free trial

#### Steps:

1. **Create Account**: [https://railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub**
3. **Add Backend**:
   - Select your repository
   - Add environment variable: `OPENAI_API_KEY`
   - Railway auto-detects Node.js
4. **Add Frontend**:
   - Add another service from same repo
   - Configure build command: `cd frontend && npm install && npm run build`
5. **Get URLs** from Railway dashboard
6. **Update** frontend to point to backend URL

---

## Important Deployment Checklist

Before deploying, make sure:

- [ ] `.env` file is NOT in your repository (listed in .gitignore)
- [ ] You've set environment variables in your hosting platform
- [ ] Frontend API calls point to your deployed backend URL
- [ ] You've tested the application locally first
- [ ] Your OpenAI account has available credits
- [ ] You understand the hosting costs

## Security Considerations

### Must-Do:

1. **Never Commit API Keys**: Keep `.env` in `.gitignore`
2. **Use Environment Variables**: Set `OPENAI_API_KEY` in hosting platform
3. **HTTPS**: All platforms provide free HTTPS
4. **Monitor Usage**: Check OpenAI dashboard regularly

### Optional (For Production):

1. **Add Authentication**:
   - Use Auth0, Clerk, or similar
   - Restrict access to your team only

2. **Rate Limiting**:
   - Add express-rate-limit to backend
   - Prevent abuse of your API

3. **Database** (for saving scorecards):
   - Add MongoDB (MongoDB Atlas free tier)
   - Or PostgreSQL (Render provides free tier)

## Updating Your Deployed App

When you make changes:

1. **Update code locally**
2. **Test locally** first
3. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
4. **Redeploy**:
   - Render: Auto-deploys on push
   - Vercel: Run `vercel --prod` or auto-deploys
   - Railway: Auto-deploys on push

## Monitoring & Maintenance

### Check These Regularly:

1. **OpenAI Usage**: [https://platform.openai.com/usage](https://platform.openai.com/usage)
2. **Hosting Metrics**: Check your hosting dashboard
3. **Error Logs**: Review logs in hosting platform
4. **API Credits**: Ensure OpenAI account has funds

### Troubleshooting Deployed App:

**App not loading**:
- Check hosting platform status
- Review error logs
- Verify environment variables are set

**API errors**:
- Check OpenAI API key is valid
- Verify you have API credits
- Check rate limits

**Slow performance**:
- Consider upgrading hosting plan
- Check if on free tier (may sleep after inactivity)
- Optimize bundle size

## Cost Breakdown (Estimated Monthly)

### Minimal Setup (Small team, light usage):
- Hosting: Free (Render/Vercel free tier)
- OpenAI API: $5-20/month (depends on usage)
- **Total: $5-20/month**

### Professional Setup (Medium team, regular usage):
- Hosting: $7-15/month (better performance)
- OpenAI API: $20-50/month
- **Total: $27-65/month**

### Usage Estimates:
- 1 job analysis ≈ $0.01-0.02
- 100 analyses/month ≈ $1-2
- 1000 analyses/month ≈ $10-20

## Getting Help

If you run into issues:

1. **Check hosting platform docs**:
   - Render: [docs.render.com](https://docs.render.com)
   - Vercel: [vercel.com/docs](https://vercel.com/docs)
   - Railway: [docs.railway.app](https://docs.railway.app)

2. **Check application logs** in your hosting dashboard

3. **Test locally first** to isolate the issue

4. **Verify environment variables** are set correctly

## Next Steps After Deployment

1. **Test thoroughly** with real job descriptions
2. **Share URL** with your team
3. **Gather feedback** from users
4. **Monitor costs** for first month
5. **Consider adding** authentication if needed

---

**Congratulations!** Your team can now access the Job Scorecard Tool from anywhere.
