import React, { useState } from 'react';
import axios from 'axios';

// Supabase configuration
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://sbrbtjsbwewppiaqrnrd.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNicmJ0anNid2V3cHBpYXFybnJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNTExMjQsImV4cCI6MjA3ODcyNzEyNH0.Ho5mjPpKGq8b9CS2gh-CXQUQV_d-WY5b-_GmOVTd8TI';

function ScorecardUpload({ onAnalysisComplete, setLoading, setError }) {
  const [inputMethod, setInputMethod] = useState('pdf'); // 'pdf' or 'url'
  const [url, setUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please select a PDF file');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (inputMethod === 'pdf') {
        if (!selectedFile) {
          setError('Please select a PDF file');
          setLoading(false);
          return;
        }

        // Convert PDF to base64
        const pdfBase64 = await fileToBase64(selectedFile);

        // Call Supabase Edge Function
        const response = await axios.post(
          `${SUPABASE_URL}/functions/v1/analyze-job-pdf`,
          {
            pdfBase64: pdfBase64,
            fileName: selectedFile.name
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
          }
        );

        onAnalysisComplete(response.data);
      } else {
        if (!url) {
          setError('Please enter a URL');
          setLoading(false);
          return;
        }

        // Call Supabase Edge Function
        const response = await axios.post(
          `${SUPABASE_URL}/functions/v1/analyze-job-url`,
          { url },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
          }
        );

        onAnalysisComplete(response.data);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setError(
        error.response?.data?.error ||
        error.response?.data?.details ||
        error.message ||
        'Failed to analyze job description'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Upload Job Description</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Upload a PDF or provide a URL to a job description. Our AI will automatically
        extract requirements and create a scorecard.
      </p>

      <div className="form-group">
        <label>Input Method:</label>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="radio"
              value="pdf"
              checked={inputMethod === 'pdf'}
              onChange={(e) => setInputMethod(e.target.value)}
              style={{ width: 'auto', marginRight: '0.5rem' }}
            />
            PDF Upload
          </label>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="radio"
              value="url"
              checked={inputMethod === 'url'}
              onChange={(e) => setInputMethod(e.target.value)}
              style={{ width: 'auto', marginRight: '0.5rem' }}
            />
            URL
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {inputMethod === 'pdf' ? (
          <div className="form-group">
            <label htmlFor="file-upload">Choose PDF File:</label>
            <input
              id="file-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
            />
            {selectedFile && (
              <p style={{ marginTop: '0.5rem', color: '#28a745', fontSize: '0.9rem' }}>
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="url-input">Job Description URL:</label>
            <input
              id="url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/job-posting"
            />
            <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
              Enter the full URL to a job posting (e.g., LinkedIn, Indeed, company website)
            </p>
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          Analyze Job Description
        </button>
      </form>
    </div>
  );
}

export default ScorecardUpload;
