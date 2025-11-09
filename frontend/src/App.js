import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import ScorecardUpload from './components/ScorecardUpload';
import ScorecardEditor from './components/ScorecardEditor';
import ScorecardView from './components/ScorecardView';

function App() {
  const [currentStep, setCurrentStep] = useState('upload'); // 'upload', 'edit', 'view'
  const [scorecard, setScorecard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalysisComplete = (data) => {
    setScorecard(data);
    setCurrentStep('edit');
  };

  const handleEditComplete = (editedScorecard) => {
    setScorecard(editedScorecard);
    setCurrentStep('view');
  };

  const handleStartOver = () => {
    setScorecard(null);
    setCurrentStep('upload');
    setError(null);
  };

  const handleBackToEdit = () => {
    setCurrentStep('edit');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Job Scorecard Tool</h1>
        <p>Automatically generate candidate evaluation scorecards from job descriptions</p>
      </header>

      <main className="App-main">
        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error}
            <button onClick={() => setError(null)} className="close-btn">×</button>
          </div>
        )}

        {currentStep === 'upload' && (
          <ScorecardUpload
            onAnalysisComplete={handleAnalysisComplete}
            setLoading={setLoading}
            setError={setError}
          />
        )}

        {currentStep === 'edit' && scorecard && (
          <ScorecardEditor
            scorecard={scorecard}
            onComplete={handleEditComplete}
            onCancel={handleStartOver}
          />
        )}

        {currentStep === 'view' && scorecard && (
          <ScorecardView
            scorecard={scorecard}
            onEdit={handleBackToEdit}
            onStartOver={handleStartOver}
          />
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Analyzing job description with AI...</p>
          </div>
        )}
      </main>

      <footer className="App-footer">
        <p>Job Scorecard Tool v1.0 | AI-Powered Recruitment Assistant</p>
      </footer>
    </div>
  );
}

export default App;
