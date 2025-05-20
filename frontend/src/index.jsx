// import React from "react";
import line1 from "./line-1.svg";
import line2 from "./line-2.svg";
import line3 from "./line-3.svg";
import record from "./record.png";
import "./style.css";
import vector from "./vector.svg";
import React, { useState, useRef } from "react";

export const Desktop = () => {
  const [results, setResults] = useState(null);
  const fileInputRef = useRef();

  const handleStart = async () => {
    const file = fileInputRef.current.files[0];
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/upload/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Simulation failed", err);
      alert("Simulation failed. See console.");
    }
  }

  return (
    <div className="desktop">
      <div className="div">
        <div className="text-wrapper">CACHE SIMULATOR</div>

        <img className="line" alt="Line" src={line1} />

        <img className="img" alt="Line" src={line2} />

        <img className="line-2" alt="Line" src={line3} />

        <img className="vector" alt="Vector" src={vector} />

        <img className="record" alt="Record" src={record} />

        <div className="text-wrapper-2">SIMULATION SETTINGS</div>

        <div className="frame">
          <div className="text-wrapper-3">Cache Size</div>

          <div className="rectangle" />
        </div>

        <div className="frame-2">
          <div className="text-wrapper-3">Block Size</div>

          <div className="rectangle" />
        </div>

        <div className="frame-3">
          <div className="text-wrapper-3">Associativity</div>

          <div className="rectangle" />
        </div>

        <div className="frame-4">
          <div className="text-wrapper-3">Replacement Policy</div>

          <div className="rectangle" />
        </div>

        <div className="group">
          <div className="text-wrapper-4">Input Trace</div>

          <div className="overlap">
            <input
              type="file"
              accept=".txt"
              ref={fileInputRef}
              style={{ marginTop: "10px", color: "white" }}
            />
          </div>

          <div className="overlap-group" onClick={handleStart} style={{ cursor: "pointer"}}>
            <div className="text-wrapper-6">START</div>
          </div>
        </div>

        <div className="overlap-wrapper">
          <div className="div-wrapper">
            <div className="text-wrapper-7">START SIMULATION</div>
          </div>
        </div>

        <div className="overlap-group-wrapper">
          <div className="div-wrapper">
            <div className="text-wrapper-8">RESET</div>
          </div>
        </div>

        <div className="text-wrapper-9">CACHE VISUALIZATION</div>

        <div className="overlap-2">
          <div className="rectangle-2" />

          <div className="overlap-3">
            <div className="rectangle-3" />

            <div className="rectangle-4" />
          </div>

          <div className="rectangle-5" />

          <div className="overlap-4">
            <div className="rectangle-6" />

            <div className="rectangle-4" />
          </div>

          <div className="rectangle-7" />

          <div className="overlap-5">
            <div className="rectangle-6" />

            <div className="rectangle-4" />
          </div>

          <div className="rectangle-8" />

          <div className="overlap-6">
            <div className="rectangle-3" />

            <div className="rectangle-9" />
          </div>

          <div className="rectangle-10" />

          <div className="overlap-7">
            <div className="rectangle-3" />

            <div className="rectangle-4" />
          </div>

          <div className="rectangle-11" />

          <div className="overlap-8">
            <div className="rectangle-6" />

            <div className="rectangle-4" />
          </div>

          <div className="rectangle-12" />

          <div className="overlap-9">
            <div className="rectangle-3" />

            <div className="rectangle-4" />
          </div>

          <div className="rectangle-13" />

          <div className="overlap-10">
            <div className="rectangle-3" />

            <div className="rectangle-4" />
          </div>

          <div className="rectangle-14" />

          <div className="overlap-11">
            <div className="rectangle-3" />

            <div className="rectangle-4" />
          </div>

          <div className="rectangle-15" />

          <div className="overlap-12">
            <div className="rectangle-3" />

            <div className="rectangle-4" />
          </div>

          <div className="rectangle-16" />

          <div className="overlap-13">
            <div className="rectangle-3" />

            <div className="rectangle-4" />
          </div>

          <div className="rectangle-17" />

          <div className="overlap-14">
            <div className="rectangle-3" />

            <div className="rectangle-4" />
          </div>

          <div className="rectangle-18" />

          <div className="overlap-15">
            <div className="rectangle-3" />

            <div className="rectangle-4" />
          </div>

          <div className="rectangle-19" />

          <div className="overlap-16">
            <div className="rectangle-3" />

            <div className="rectangle-4" />
          </div>

          <div className="rectangle-20" />

          <div className="overlap-17">
            <div className="rectangle-3" />

            <div className="rectangle-4" />
          </div>

          <div className="rectangle-21" />

          <div className="overlap-18">
            <div className="rectangle-3" />

            <div className="rectangle-4" />
          </div>
        </div>

        <div className="text-wrapper-10">SIMULATION RESULTS</div>

        <div className="group-2">
          <div className="text-wrapper-11">Hits: {results?.hits ?? 0}</div>
          <div className="text-wrapper-12">Misses: {results?.misses ?? 0}</div>
          <div className="text-wrapper-13">Probe Hits: {results?.probe_hits ?? 0}</div>
          <div className="text-wrapper-14">Hit Rate: {results ? ((results.hits / (results.hits + results.misses)) * 100).toFixed(2) + "%" : "0.00%"}</div>
          <div className="text-wrapper-15">Load Factor: {results?.load_factor ?? 0}</div>
          <div className="text-wrapper-16">Probe Misses: {results?.probe_misses ?? 0}</div>
          <div className="text-wrapper-17">Chain Misses: {results?.chain_misses ?? 0}</div>
          <div className="text-wrapper-18">Misses: {results?.misses ?? 0}</div>
          <div className="text-wrapper-19">Collisions: {results?.collisions ?? 0}</div>
          <div className="text-wrapper-20">Chain Hits: {results?.chain_hits ?? 0}</div>
        </div>
      </div>
    </div>
  );
};