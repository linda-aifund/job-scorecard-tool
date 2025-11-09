import React, { useState, useEffect } from 'react';

function ScorecardEditor({ scorecard, onComplete, onCancel }) {
  const [jobTitle, setJobTitle] = useState(scorecard.jobTitle || '');
  const [summary, setSummary] = useState(scorecard.summary || '');
  const [mustHave, setMustHave] = useState(scorecard.mustHave || []);
  const [niceToHave, setNiceToHave] = useState(scorecard.niceToHave || []);
  const [totalWeight, setTotalWeight] = useState(100);

  useEffect(() => {
    const total = mustHave.reduce((sum, item) => sum + (item.suggestedWeight || 0), 0);
    setTotalWeight(total);
  }, [mustHave]);

  const handleWeightChange = (index, newWeight) => {
    const weight = parseInt(newWeight) || 0;
    const updated = [...mustHave];
    updated[index].suggestedWeight = weight;
    setMustHave(updated);
  };

  const handleRequirementChange = (index, field, value) => {
    const updated = [...mustHave];
    updated[index][field] = value;
    setMustHave(updated);
  };

  const handleAddMustHave = () => {
    setMustHave([
      ...mustHave,
      {
        requirement: '',
        category: 'Other',
        suggestedWeight: 0
      }
    ]);
  };

  const handleRemoveMustHave = (index) => {
    const updated = mustHave.filter((_, i) => i !== index);
    setMustHave(updated);
  };

  const handleNiceToHaveChange = (index, value) => {
    const updated = [...niceToHave];
    updated[index] = value;
    setNiceToHave(updated);
  };

  const handleAddNiceToHave = () => {
    setNiceToHave([...niceToHave, '']);
  };

  const handleRemoveNiceToHave = (index) => {
    const updated = niceToHave.filter((_, i) => i !== index);
    setNiceToHave(updated);
  };

  const normalizeWeights = () => {
    if (mustHave.length === 0) return;

    const currentTotal = mustHave.reduce((sum, item) => sum + item.suggestedWeight, 0);
    if (currentTotal === 0) return;

    const normalized = mustHave.map(item => ({
      ...item,
      suggestedWeight: Math.round((item.suggestedWeight / currentTotal) * 100)
    }));

    // Adjust to ensure exactly 100
    const newTotal = normalized.reduce((sum, item) => sum + item.suggestedWeight, 0);
    if (newTotal !== 100 && normalized.length > 0) {
      normalized[0].suggestedWeight += (100 - newTotal);
    }

    setMustHave(normalized);
  };

  const handleSave = () => {
    // Filter out empty items
    const filteredMustHave = mustHave.filter(item => item.requirement.trim() !== '');
    const filteredNiceToHave = niceToHave.filter(item => item.trim() !== '');

    onComplete({
      ...scorecard,
      jobTitle,
      summary,
      mustHave: filteredMustHave,
      niceToHave: filteredNiceToHave
    });
  };

  return (
    <div className="card">
      <h2>Edit Scorecard</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Review and customize the requirements and their weights. Weights should total 100%.
      </p>

      <div className="form-group">
        <label>Job Title:</label>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g., Senior Software Engineer"
        />
      </div>

      <div className="form-group">
        <label>Job Summary:</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows="3"
          placeholder="Brief description of the role..."
        />
      </div>

      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Must-Have Requirements</h3>
          <div>
            <span style={{
              padding: '0.5rem 1rem',
              background: totalWeight === 100 ? '#d4edda' : '#f8d7da',
              color: totalWeight === 100 ? '#155724' : '#721c24',
              borderRadius: '6px',
              fontWeight: 'bold'
            }}>
              Total Weight: {totalWeight}%
            </span>
            <button
              type="button"
              onClick={normalizeWeights}
              className="btn btn-secondary"
              style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}
            >
              Auto-Normalize to 100%
            </button>
          </div>
        </div>

        {mustHave.map((item, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              marginTop: '1rem'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.9rem' }}>Requirement:</label>
                <input
                  type="text"
                  value={item.requirement}
                  onChange={(e) => handleRequirementChange(index, 'requirement', e.target.value)}
                  placeholder="e.g., 5+ years experience with React"
                />
              </div>
              <div style={{ width: '120px' }}>
                <label style={{ fontSize: '0.9rem' }}>Weight (%):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={item.suggestedWeight}
                  onChange={(e) => handleWeightChange(index, e.target.value)}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'end' }}>
              <div>
                <label style={{ fontSize: '0.9rem' }}>Category:</label>
                <select
                  value={item.category}
                  onChange={(e) => handleRequirementChange(index, 'category', e.target.value)}
                >
                  <option value="Technical Skills">Technical Skills</option>
                  <option value="Experience">Experience</option>
                  <option value="Education">Education</option>
                  <option value="Soft Skills">Soft Skills</option>
                  <option value="Certifications">Certifications</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveMustHave(index)}
                className="btn btn-danger"
                style={{ padding: '0.5rem 1rem' }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddMustHave}
          className="btn btn-secondary"
          style={{ marginTop: '1rem' }}
        >
          + Add Must-Have Requirement
        </button>
      </div>

      <div className="form-group">
        <h3>Nice-to-Have Requirements</h3>
        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
          These items won't be weighted, but will be listed for reference
        </p>

        {niceToHave.map((item, index) => (
          <div
            key={index}
            style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}
          >
            <input
              type="text"
              value={item}
              onChange={(e) => handleNiceToHaveChange(index, e.target.value)}
              placeholder="e.g., Experience with TypeScript"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => handleRemoveNiceToHave(index)}
              className="btn btn-danger"
              style={{ padding: '0.5rem 1rem' }}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddNiceToHave}
          className="btn btn-secondary"
          style={{ marginTop: '0.5rem' }}
        >
          + Add Nice-to-Have
        </button>
      </div>

      <div className="btn-group">
        <button onClick={handleSave} className="btn btn-success">
          Save & Continue to Scorecard
        </button>
        <button onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ScorecardEditor;
