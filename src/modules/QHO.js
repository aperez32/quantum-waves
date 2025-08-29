// modules/QHO.js
import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

// Hermite polynomial generator
function hermite(n, x) {
  if (n === 0) return 1.0;
  if (n === 1) return 2 * x;
  return 2 * x * hermite(n - 1, x) - 2 * (n - 1) * hermite(n - 2, x);
}

// Factorial
function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

// Normalized QHO wavefunction with omega
function psi(n, x, omega) {
  const xi = Math.sqrt(omega) * x; // scaled x
  const Hn = hermite(n, xi);
  const norm = Math.pow(omega / Math.PI, 0.25) / Math.sqrt(Math.pow(2, n) * factorial(n));
  return norm * Hn * Math.exp(-0.5 * xi * xi);
}

export default function QHO() {
  const [n, setN] = useState(0);
  const [omega, setOmega] = useState(1.0);
  const [animate, setAnimate] = useState(false);
  const [t, setT] = useState(0);
  const [showClassical, setShowClassical] = useState(true);

  // Animation timer
  useEffect(() => {
    if (!animate) return;
    const interval = setInterval(() => setT(prev => prev + 0.05), 50);
    return () => clearInterval(interval);
  }, [animate]);

  const x = Array.from({ length: 400 }, (_, i) => (i / 50) - 4);
  const V = x.map(xi => 0.5 * omega * omega * xi * xi);
  const E = (n + 0.5) * omega;

  const psiVals = animate
    ? x.map(xi => psi(n, xi, omega) * Math.cos(E * t))
    : x.map(xi => psi(n, xi, omega));

  const probDensity = x.map(xi => psi(n, xi, omega) ** 2);

  // Classical particle
  const A = 4;
  const x_classical = A * Math.cos(omega * t);

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Plots */}
      <div style={{ display: "flex", gap: "24px" }}>
        <div style={{ backgroundColor: "#1f2937", padding: "16px", borderRadius: "8px", width: "60px" }}>
          <h3 style={{ color: "#f3f4f6", fontSize: "14px" }}>|ψ(x)|²</h3>
          <Plot
            data={[{
              x: Array(x.length).fill(0).map(() => [0,1,2,3]),
              y: x,
              z: probDensity.map(v => Array(4).fill(v)),
              type: "heatmap",
              colorscale: "Viridis",
              showscale: false
            }]}
            layout={{
              margin: { t: 10, l: 10, r: 10, b: 10 },
              xaxis: { visible: false },
              yaxis: { range: [-4.5, 4.5], autorange: false },
              paper_bgcolor: "transparent",
              plot_bgcolor: "transparent"
            }}
            style={{ width: "60px", height: "600px" }}
          />
        </div>

        <div style={{ flex: 1, backgroundColor: "#1f2937", padding: "16px", borderRadius: "8px" }}>
          <Plot
            data={[
              { x, y: psiVals, type: "scatter", mode: "lines", line: { color: "#3b82f6", width: 3 }, name: "ψ(x,t)" },
              { x, y: V, type: "scatter", mode: "lines", line: { color: "#f59e0b", width: 2 }, name: "V(x)" },
              showClassical && { x: [x_classical], y: [0], type: "scatter", mode: "markers", marker: { size: 16, color: "#10b981" }, name: "Classical Particle" },
            ].filter(Boolean)}
            layout={{
              margin: { t: 30, l: 30, r: 30, b: 30 },
              xaxis: { range: [-4.5, 4.5], title: "x", gridcolor: "#374151", zeroline: false, fixedrange: true },
              yaxis: { range: [-1.5, 3], title: "ψ(x,t), V(x)", gridcolor: "#374151", zeroline: false, fixedrange: true },
              paper_bgcolor: "transparent",
              plot_bgcolor: "transparent"
            }}
            style={{ width: "100%", height: "600px" }}
          />
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "24px", width: "100%" }}>
        <div style={{ flex: 1, minWidth: "300px", backgroundColor: "#111827", padding: "16px", borderRadius: "8px" }}>
          <h2 style={{ color: "#f3f4f6", marginBottom: "8px" }}>Current Parameters</h2>

          <label style={{ color: "#f3f4f6", fontWeight: "bold" }}>Quantum Number (n): {n}</label>
          <input type="range" min="0" max="5" value={n} onChange={(e) => setN(parseInt(e.target.value))} style={{ width: "100%", marginTop: "8px" }} />

          <label style={{ color: "#f3f4f6", fontWeight: "bold", marginTop: "12px", display: "block" }}>Oscillator Frequency ω: {omega.toFixed(2)}</label>
          <input type="range" min="0.1" max="5" step="0.1" value={omega} onChange={(e) => setOmega(parseFloat(e.target.value))} style={{ width: "100%", marginTop: "8px" }} />

          <div style={{ marginTop: "16px" }}>
            <label style={{ color: "#f3f4f6", fontWeight: "bold" }}>
              <input type="checkbox" checked={animate} onChange={(e) => setAnimate(e.target.checked)} /> Animate
            </label>
          </div>
          <div style={{ marginTop: "12px" }}>
            <button
              onClick={() => setShowClassical(prev => !prev)}
              style={{
                padding: "8px 12px",
                backgroundColor: "#1f2937",
                color: "#f3f4f6",
                border: "1px solid #374151",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Toggle Classical Oscillator
            </button>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: "300px", backgroundColor: "#111827", padding: "16px", borderRadius: "8px" }}>
          <h2 style={{ color: "#f3f4f6", marginBottom: "8px" }}>General Equations</h2>
          <BlockMath math={String.raw`\big(-\frac{\hbar^2}{2m} \frac{d^2}{dx^2} + \tfrac{1}{2} m \omega^2 x^2 \big)\psi = E \psi`} />
          <BlockMath math={String.raw`\psi_n(x) = \frac{1}{\sqrt{2^n n!}} \left(\frac{m \omega}{\pi \hbar}\right)^{1/4} e^{-m\omega x^2 / (2\hbar)} H_n\!\left(\sqrt{\tfrac{m\omega}{\hbar}}\, x\right)`} />
          <BlockMath math={String.raw`E_n = \left(n + \tfrac{1}{2}\right)\hbar \omega`} />
        </div>
      </div>
    </div>
  );
}
