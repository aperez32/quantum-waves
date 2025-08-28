import React, { useState } from "react";

function App() {
  const [n, setN] = useState(1);

  // Generate x values
  const xs = Array.from({ length: 200 }, (_, i) => i / 200 * Math.PI);
  // Wavefunction: ψ(x) = sqrt(2/L) * sin(nπx/L), here L = π for simplicity
  const ys = xs.map(x => Math.sin(n * x));

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <h1>Quantum Wavefunction Demo</h1>

      <label>
        Quantum number n:
        <input
          type="range"
          min="1"
          max="5"
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          style={{ width: "300px", margin: "0 10px" }}
        />
        {n}
      </label>

      <svg width="600" height="300" style={{ border: "1px solid black" }}>
        <polyline
          fill="none"
          stroke="blue"
          strokeWidth="2"
          points={xs
            .map((x, i) => {
              const px = (x / Math.PI) * 600; // scale x
              const py = 150 - ys[i] * 100;   // scale y
              return `${px},${py}`;
            })
            .join(" ")}
        />
      </svg>
    </div>
  );
}

export default App;
