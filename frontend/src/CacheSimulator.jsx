import React, { useState } from 'react';
import './CacheSimulator.css'; // Import CSS

// About section as inline component
const AboutSection = ({ onClose }) => (
  <div className="about-page" style={{ padding: '40px', background: '#161b22', borderRadius: '8px', margin: '30px 0' }}>
    <h2>About the Hybrid Cache Algorithm</h2>
    <p>
      This simulator uses a custom hybrid cache replacement algorithm implemented in C++. The algorithm combines features of traditional policies (like LRU, LFU, FIFO, etc.) to optimize cache performance for a variety of workloads. It tracks cache hits, misses, and other statistics to help analyze the effectiveness of the caching strategy.
    </p>
    <p>
      <b>Key Features:</b>
      <ul>
        <li>Hybrid approach: blends multiple cache replacement strategies</li>
        <li>Efficient hashtable-based implementation</li>
        <li>Designed for educational and performance analysis purposes</li>
      </ul>
    </p>
    <p>
      For more details, see the project documentation or source code.
    </p>
    <button onClick={onClose} style={{ marginTop: '20px', padding: '8px 18px', background: '#238636', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Close</button>
  </div>
);

const CacheSimulator = () => {
  // Backend simulation states
  const [backendFile, setBackendFile] = useState(null);
  const [backendResult, setBackendResult] = useState(null);
  const [backendError, setBackendError] = useState('');
  const [backendLoading, setBackendLoading] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

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
          <a href="#" onClick={e => { e.preventDefault(); setShowAbout(false); }}>Home</a>
          <a href="#" onClick={e => { e.preventDefault(); setShowAbout(true); }}>About</a>
        </nav>
      </header>
      <hr style={{ border: 'none', borderTop: '4px solid orange', margin: 0 }} />
      {showAbout && <AboutSection onClose={() => setShowAbout(false)} />}
      {!showAbout && (
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
          </div>
          <div className="right">
            {backendResult && (
              <div className="simulation-result" style={{ marginTop: '20px' }}>
                <h4>Simulation Result</h4>
                <pre style={{ background: '#21262d', padding: '10px', borderRadius: '5px', color: '#e6edf3' }}>{JSON.stringify(backendResult, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CacheSimulator;
