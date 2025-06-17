import React, { useState } from 'react';
import './CacheSimulator.css'; // Make sure to style accordingly

const CacheSimulator = () => {
  const [cacheSize, setCacheSize] = useState('');
  const [blockSize, setBlockSize] = useState('');
  const [addresses, setAddresses] = useState('');
  const [results, setResults] = useState([]);
  const [hitRate, setHitRate] = useState(null);
  const [testCases, setTestCases] = useState([]);

  const handleSimulate = () => {
    if (!cacheSize || !blockSize || !addresses) return;

    const addrList = addresses.split(',').map(a => parseInt(a.trim()));
    const cacheLines = new Map();
    let hits = 0;

    const simulation = addrList.map(addr => {
      const block = Math.floor(addr / blockSize);
      const line = block % (cacheSize / blockSize);
      const isHit = cacheLines.get(line) === block;

      if (isHit) hits++;
      else cacheLines.set(line, block);

      return {
        address: addr,
        block,
        cacheLine: line,
        hit: isHit ? 'Hit' : 'Miss'
      };
    });

    setResults(simulation);
    setHitRate(((hits / addrList.length) * 100).toFixed(0));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      setAddresses(fileContent.replace(/\n/g, ','));
    };
    reader.readAsText(file);
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const lines = event.target.result.trim().split('\n');
      const [headerLine, ...dataLines] = lines;
      const headers = headerLine.split(',');

      const parsedData = dataLines.map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((h, i) => obj[h.trim()] = values[i].trim());
        return obj;
      });

      setTestCases(parsedData);
    };
    reader.readAsText(file);
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
          <h3>Inputs</h3>
          <label>Cache Size</label>
          <input type="number" value={cacheSize} onChange={e => setCacheSize(e.target.value)} />

          <label>Block Size</label>
          <input type="number" value={blockSize} onChange={e => setBlockSize(e.target.value)} />

          <label>Address List</label>
          <input type="text" value={addresses} onChange={e => setAddresses(e.target.value)} placeholder="e.g. 4, 12, 8, 16" />

          <label>Upload Address File (.txt)</label>
          <input type="file" accept=".txt" onChange={handleFileUpload} />

          <label>Upload Test Cases File (.csv)</label>
          <input type="file" accept=".csv" onChange={handleCSVUpload} />

          <button onClick={handleSimulate}>Simulate Cache</button>
        </div>

        <div className="right">
          <h3>Simulation Output</h3>
          {results.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Block</th>
                  <th>Cache Line</th>
                  <th>Hit/Miss</th>
                </tr>
              </thead>
              <tbody>
                {results.map((res, idx) => (
                  <tr key={idx}>
                    <td>{res.address}</td>
                    <td>{res.block}</td>
                    <td>{res.cacheLine}</td>
                    <td>{res.hit}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3">Hit Ratio</td>
                  <td>{hitRate}%</td>
                </tr>
              </tfoot>
            </table>
          )}

          {testCases.length > 0 && (
            <>
              <h3>Test Case Results</h3>
              <table>
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Hits</th>
                    <th>Misses</th>
                    <th>Collisions</th>
                    <th>Load Factor</th>
                  </tr>
                </thead>
                <tbody>
                  {testCases.map((test, idx) => (
                    <tr key={idx}>
                      <td>{test["Test Name"]}</td>
                      <td>{test["Hits"]}</td>
                      <td>{test["Misses"]}</td>
                      <td>{test["Collisions"]}</td>
                      <td>{test["Load Factor"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CacheSimulator;
