require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const cheerio = require('cheerio');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3001;

// Configure OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads (store in memory)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Job Scorecard API is running' });
});

// Extract text from URL
async function extractTextFromUrl(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);

    // Remove script and style elements
    $('script, style, nav, header, footer').remove();

    // Get text content
    const text = $('body').text()
      .replace(/\s+/g, ' ')
      .trim();

    return text;
  } catch (error) {
    throw new Error(`Failed to fetch URL: ${error.message}`);
  }
}

// Analyze job description with OpenAI
async function analyzeJobDescription(text) {
  try {
    const prompt = `You are an expert recruiter analyzing a job description. Extract and categorize the requirements.

Job Description:
${text}

Please analyze this job description and provide a structured response in JSON format with:
1. "mustHave": An array of must-have requirements. Each item should be:
   - "requirement": Clear description of the requirement
   - "suggestedWeight": A number between 5-30 representing importance (all weights should sum to approximately 100)
   - "category": One of: "Technical Skills", "Experience", "Education", "Soft Skills", "Certifications", "Other"

2. "niceToHave": An array of nice-to-have requirements (just strings)

3. "jobTitle": The job title
4. "summary": A brief 1-2 sentence summary of the role

Focus on concrete, measurable requirements. Be specific and avoid vague statements.

Return ONLY valid JSON, no other text.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert recruiter and hiring manager. You analyze job descriptions and extract structured requirements for evaluation scorecards. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const content = response.choices[0].message.content.trim();

    // Remove markdown code block if present
    let jsonString = content;
    if (content.startsWith('```json')) {
      jsonString = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    } else if (content.startsWith('```')) {
      jsonString = content.replace(/```\n?/g, '').trim();
    }

    const analysis = JSON.parse(jsonString);

    // Normalize weights to sum to 100
    const totalWeight = analysis.mustHave.reduce((sum, item) => sum + item.suggestedWeight, 0);
    if (totalWeight > 0) {
      analysis.mustHave = analysis.mustHave.map(item => ({
        ...item,
        suggestedWeight: Math.round((item.suggestedWeight / totalWeight) * 100)
      }));

      // Adjust to ensure exactly 100
      const newTotal = analysis.mustHave.reduce((sum, item) => sum + item.suggestedWeight, 0);
      if (newTotal !== 100 && analysis.mustHave.length > 0) {
        analysis.mustHave[0].suggestedWeight += (100 - newTotal);
      }
    }

    return analysis;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(`Failed to analyze job description: ${error.message}`);
  }
}

// Endpoint: Analyze job description from PDF
app.post('/api/analyze/pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'PDF appears to be empty or contains no extractable text' });
    }

    // Analyze with OpenAI
    const analysis = await analyzeJobDescription(text);

    res.json({
      success: true,
      source: 'pdf',
      fileName: req.file.originalname,
      ...analysis
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({
      error: 'Failed to process PDF',
      details: error.message
    });
  }
});

// Endpoint: Analyze job description from URL
app.post('/api/analyze/url', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Extract text from URL
    const text = await extractTextFromUrl(url);

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'No text content found at URL' });
    }

    // Analyze with OpenAI
    const analysis = await analyzeJobDescription(text);

    res.json({
      success: true,
      source: 'url',
      sourceUrl: url,
      ...analysis
    });
  } catch (error) {
    console.error('Error processing URL:', error);
    res.status(500).json({
      error: 'Failed to process URL',
      details: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Job Scorecard API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);

  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  WARNING: OPENAI_API_KEY not set in environment variables');
  }
});
