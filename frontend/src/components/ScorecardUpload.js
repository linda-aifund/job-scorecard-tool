import React, { useState } from 'react';
import axios from 'axios';

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

        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await axios.post('/api/analyze/pdf', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        onAnalysisComplete(response.data);
      } else {
        if (!url) {
          setError('Please enter a URL');
          setLoading(false);
          return;
        }

        const response = await axios.post('/api/analyze/url', { url });
        onAnalysisComplete(response.data);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setError(
        error.response?.data?.details ||
        error.response?.data?.error ||
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
