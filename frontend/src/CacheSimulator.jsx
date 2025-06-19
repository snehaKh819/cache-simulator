import React, { useState } from 'react';
import './CacheSimulator.css'; // Import CSS
import logo from './logo.png';

// About section as inline component
const AboutSection = ({ onClose }) => (
  <div className="about-page" style={{ padding: '40px', background: '#161b22', borderRadius: '8px', margin: '30px 0' }}>
    <h2>About the Hybrid Cache Algorithm</h2>

    <p>
        Our cache simulator is powered by a <strong>hybrid collision resolution
        algorithm</strong> that combines multiple strategies to ensure both
        efficiency and robustness in key insertion and retrieval. Here's how it
        works under the hood:
      </p>

      <h3>1️⃣ Multi-dimensional Hashing</h3>
      <p>
        Keys are stored in a <strong>2D hash table</strong>, allowing a broader and more
        even distribution than a flat 1D structure. A custom bitwise hash
        function is used to minimize clustering and improve randomness. The
        hashed coordinates <code>(i, j)</code> determine the initial location for a given key.
      </p>

      <h3>2️⃣ Primary Insertion</h3>
      <p>
        If the target cell <code>(i, j)</code> is empty, the key is inserted directly.
        If not, the algorithm begins a series of fallback strategies to resolve
        the collision.
      </p>

      <h3>3️⃣ Quadratic Probing</h3>
      <p>
        The algorithm first attempts <strong>quadratic probing</strong>, where the next
        position is calculated using the formula:
        <br />
        <code>(i + probe², j + probe²) % table size</code>
        <br />
        This spreads out probe positions non-linearly, reducing the chances of
        primary clustering.
      </p>

      <h3>4️⃣ Double Hashing</h3>
      <p>
        If quadratic probing doesn't succeed, <strong>double hashing</strong> is used.
        This applies a second hash function to calculate an alternative probe
        step, further minimizing the risk of repeated collisions.
      </p>

      <h3>5️⃣ Chaining Fallback</h3>
      <p>
        If all probing attempts fail, the algorithm falls back to
        <strong>separate chaining</strong> by storing the key in a linked list at the
        original <code>(i, j)</code> cell. This guarantees successful insertion even
        under heavy load.
      </p>

      <h3>6️⃣ Dynamic Resizing (Rehashing)</h3>
      <p>
        If the <strong>load factor</strong> (ratio of filled slots to total capacity)
        exceeds a threshold, the table size is doubled and all keys are
        <strong> rehashed </strong> into the larger structure to maintain efficiency.
      </p>

      <h3>📊 Why This Is Effective</h3>
      <ul>
        <li>
          Combines <strong>open addressing</strong> (probing) and <strong>separate chaining</strong>
          for optimal collision resolution
        </li>
        <li>
          Supports <strong>dynamic resizing</strong>, ensuring scalability
        </li>
        <li>
          Tracks detailed stats: hits, misses, collisions, probe vs. chain success
        </li>
      </ul>

      <p>
        This hybrid approach makes our algorithm ideal for cache simulation,
        offering both speed and resilience under large-scale workloads.
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <img src={logo} alt="Cache Simulator Logo" style={{ height: '56px', width: '56px' }} />
          <h2 style={{ margin: 0 }}>HASHCACHE - Cache Simulator</h2>
        </div>
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
            <h3>Backend Simulation (Hybrid NOF Algorithm)</h3>
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
                <h3>Simulation Result</h3>
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
