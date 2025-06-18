import React, { useState } from 'react';
import './CacheSimulator.css'; // Import CSS

const CacheSimulator = () => {
  // Backend simulation states
  const [backendFile, setBackendFile] = useState(null);
  const [backendResult, setBackendResult] = useState(null);
  const [backendError, setBackendError] = useState('');
  const [backendLoading, setBackendLoading] = useState(false);

  // Backend file upload handlers
  const handleBackendFileChange = (e) => {
    setBackendFile(e.target.files[0]);
    setBackendResult(null);
    setBackendError('');
  };

  const handleBackendSimulate = async (e) => {
    e.preventDefault();
    if (!backendFile) {
      setBackendError('Please select a file.');
      return;
    }
    setBackendLoading(true);
    setBackendError('');
    setBackendResult(null);

    const formData = new FormData();
    formData.append('file', backendFile);

    try {
      const response = await fetch('http://localhost:8000/api/upload/', {
        method: 'POST',
        body: formData,
      });

      let text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(text);
      }

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setBackendResult(data);
    } catch (err) {
      setBackendError(err.message);
    } finally {
      setBackendLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h2>CACHE SIMULATOR</h2>
        <nav>
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Help</a>
        </nav>
      </header>

      <div className="sim-body">
        <div className="left">
          <h3>Backend Simulation (Hybrid Algorithm)</h3>
          <form onSubmit={handleBackendSimulate}>
            <label>Upload Address File (.txt)</label>
            <input type="file" accept=".txt" onChange={handleBackendFileChange} />
            <button type="submit" disabled={backendLoading} style={{ marginTop: '10px' }}>
              {backendLoading ? 'Simulating...' : 'Upload & Simulate'}
            </button>
          </form>
          {backendError && <div style={{ color: 'red', marginTop: '10px' }}>{backendError}</div>}
          {backendResult && (
            <div className="simulation-result" style={{ marginTop: '20px' }}>
              <h4>Simulation Result</h4>
              <pre style={{ background: '#21262d', padding: '10px', borderRadius: '5px', color: '#e6edf3' }}>{JSON.stringify(backendResult, null, 2)}</pre>
            </div>
          )}

          {/* Visualization of cache state per step */}
          {backendResult?.steps && (
            <div style={{ marginTop: '30px' }}>
              <h4>Cache Visualization (Step by Step)</h4>
              {backendResult.steps.map((step, idx) => {
                // Try to infer a square or near-square grid
                const cacheLen = step.cache.length;
                let numRows = Math.floor(Math.sqrt(cacheLen));
                let numCols = Math.ceil(cacheLen / numRows);
                if (numRows * numCols < cacheLen) numRows++;
                return (
                  <div key={idx} style={{ marginBottom: '18px', padding: '10px', background: '#161b22', borderRadius: '6px' }}>
                    <div style={{ marginBottom: '6px' }}>
                      <strong>Step {idx + 1}:</strong> Address <span style={{ color: '#58a6ff' }}>{step.address}</span> — <span style={{ color: step.result === 'hit' ? '#2ea043' : '#e5534b' }}>{step.result.toUpperCase()}</span>
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${numCols}, 40px)`,
                      gap: '6px'
                    }}>
                      {step.cache.map((val, i) => (
                        <div
                          key={i}
                          style={{
                            width: 40,
                            height: 40,
                            background: val === step.address ? '#238636' : '#21262d',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #30363d',
                            borderRadius: 4,
                            fontWeight: 'bold',
                            fontSize: '1.1em',
                          }}
                        >
                          {val !== -1 && val !== null ? val : '-'}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CacheSimulator;
