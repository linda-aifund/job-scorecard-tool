import React, { useState } from 'react';

function ScorecardView({ scorecard, onEdit, onStartOver }) {
  const [candidateName, setCandidateName] = useState('');
  const [scores, setScores] = useState({});
  const [showScoring, setShowScoring] = useState(false);

  const handleScoreChange = (index, score) => {
    const numScore = parseInt(score) || 0;
    setScores({
      ...scores,
      [index]: Math.min(Math.max(numScore, 0), 10) // Clamp between 0-10
    });
  };

  const calculateTotalScore = () => {
    let total = 0;
    scorecard.mustHave.forEach((item, index) => {
      const score = scores[index] || 0;
      total += (score / 10) * item.suggestedWeight;
    });
    return total.toFixed(1);
  };

  const handlePrint = () => {
    window.print();
  };

  const groupByCategory = (items) => {
    const grouped = {};
    items.forEach(item => {
      const category = item.category || 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });
    return grouped;
  };

  const groupedRequirements = groupByCategory(scorecard.mustHave);

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h2>{scorecard.jobTitle || 'Job Scorecard'}</h2>
            {scorecard.summary && (
              <p style={{ color: '#666', marginTop: '0.5rem' }}>{scorecard.summary}</p>
            )}
          </div>
          <div className="no-print" style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={onEdit} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
              Edit
            </button>
            <button onClick={onStartOver} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
              Start Over
            </button>
          </div>
        </div>

        {scorecard.source && (
          <div style={{
            background: '#f8f9fa',
            padding: '0.75rem',
            borderRadius: '6px',
            marginTop: '1rem',
            fontSize: '0.9rem'
          }}>
            <strong>Source:</strong> {scorecard.source === 'pdf' ? `PDF - ${scorecard.fileName}` : scorecard.sourceUrl}
          </div>
        )}
      </div>

      <div className="card no-print">
        <h3>Candidate Evaluation (Optional)</h3>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Enter a candidate name and score each requirement (0-10) to calculate their fit score.
        </p>
        <div className="form-group">
          <label>Candidate Name:</label>
          <input
            type="text"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder="Enter candidate name"
          />
        </div>
        <button
          onClick={() => setShowScoring(!showScoring)}
          className="btn btn-primary"
        >
          {showScoring ? 'Hide' : 'Show'} Scoring Interface
        </button>
      </div>

      <div className="card">
        {candidateName && (
          <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '2px solid #eee' }}>
            <h3 style={{ margin: 0 }}>Candidate: {candidateName}</h3>
            {showScoring && Object.keys(scores).length > 0 && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#f0f8ff',
                borderRadius: '8px',
                fontSize: '1.2rem'
              }}>
                <strong>Total Score: {calculateTotalScore()}%</strong>
              </div>
            )}
          </div>
        )}

        <h3>Must-Have Requirements (Weighted)</h3>

        {Object.entries(groupedRequirements).map(([category, items]) => (
          <div key={category} style={{ marginTop: '1.5rem' }}>
            <h4 style={{
              color: '#667eea',
              borderBottom: '2px solid #667eea',
              paddingBottom: '0.5rem',
              marginBottom: '1rem'
            }}>
              {category}
            </h4>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem' }}>Requirement</th>
                  <th style={{ textAlign: 'center', padding: '0.75rem', width: '100px' }}>Weight</th>
                  {showScoring && (
                    <>
                      <th style={{ textAlign: 'center', padding: '0.75rem', width: '120px' }} className="no-print">
                        Score (0-10)
                      </th>
                      <th style={{ textAlign: 'center', padding: '0.75rem', width: '120px' }} className="no-print">
                        Weighted Score
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const globalIndex = scorecard.mustHave.indexOf(item);
                  const score = scores[globalIndex] || 0;
                  const weightedScore = ((score / 10) * item.suggestedWeight).toFixed(1);

                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '0.75rem' }}>{item.requirement}</td>
                      <td style={{ textAlign: 'center', padding: '0.75rem', fontWeight: 'bold' }}>
                        {item.suggestedWeight}%
                      </td>
                      {showScoring && (
                        <>
                          <td style={{ textAlign: 'center', padding: '0.75rem' }} className="no-print">
                            <input
                              type="number"
                              min="0"
                              max="10"
                              value={score}
                              onChange={(e) => handleScoreChange(globalIndex, e.target.value)}
                              style={{ width: '60px', textAlign: 'center' }}
                            />
                          </td>
                          <td style={{ textAlign: 'center', padding: '0.75rem', fontWeight: 'bold' }} className="no-print">
                            {weightedScore}%
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}

        {scorecard.niceToHave && scorecard.niceToHave.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3>Nice-to-Have Requirements</h3>
            <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
              {scorecard.niceToHave.map((item, index) => (
                <li key={index} style={{ marginBottom: '0.5rem', lineHeight: '1.6' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="no-print" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button onClick={handlePrint} className="btn btn-success">
          Print / Save as PDF
        </button>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
        <h4>Scoring Guide:</h4>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
          <li><strong>0-3:</strong> Does not meet requirement</li>
          <li><strong>4-6:</strong> Partially meets requirement</li>
          <li><strong>7-8:</strong> Meets requirement</li>
          <li><strong>9-10:</strong> Exceeds requirement</li>
        </ul>
      </div>
    </div>
  );
}

export default ScorecardView;
