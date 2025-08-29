// modules/RigidRotor.js
import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

export default function RigidRotor() {
  const [m, setM] = useState(0); // angular quantum number
  const [animate, setAnimate] = useState(false);
  const [showClassical, setShowClassical] = useState(true);
  const [t, setT] = useState(0);
  const R = 3; // radius

  // Animation timer
  useEffect(() => {
    if (!animate) return;
    const interval = setInterval(() => setT(prev => prev + 0.05), 50);
    return () => clearInterval(interval);
  }, [animate]);

  const omega = 1;
  const theta_classical = omega * t;
  const x_classical = R * Math.cos(theta_classical);
  const y_classical = R * Math.sin(theta_classical);

  const N = 200;
  const theta = Array.from({ length: N }, (_, i) => (i / (N - 1)) * 2 * Math.PI);

  // Quantum wave
  const quantumWave = theta.map(th => R + 0.5 * Math.sin(m * th) * Math.cos(m * t));
  const quantumX = quantumWave.map((r, i) => r * Math.cos(theta[i]));
  const quantumY = quantumWave.map((r, i) => r * Math.sin(theta[i]));

  // Static probability (for heatmap)
  const probDensity = theta.map(th => Math.sin(m * th) ** 2);
  const heatmapY = theta.map(th => R * Math.sin(th));
  const heatmapZ = probDensity.map(p => Array(4).fill(p)); // repeated across small width

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Top plots */}
      <div style={{ display: "flex", gap: "24px" }}>
        {/* Left: Vertical heatmap */}
        <div style={{ backgroundColor: "#1f2937", padding: "16px", borderRadius: "8px", width: "60px" }}>
          <h3 style={{ color: "#f3f4f6", fontSize: "14px" }}>|ψ(θ)|²</h3>
          <Plot
            data={[
              {
                x: Array(theta.length).fill([0, 1, 2, 3]),
                y: theta,
                z: heatmapZ,
                type: "heatmap",
                colorscale: "Viridis",
                showscale: false,
              },
            ]}
            layout={{
              margin: { t: 10, l: 10, r: 10, b: 10 },
              xaxis: { visible: false },
              yaxis: { range: [0, 2 * Math.PI], autorange: false },
              paper_bgcolor: "transparent",
              plot_bgcolor: "transparent",
            }}
            style={{ width: "60px", height: "400px" }}
          />
        </div>

        {/* Right: Rotor plot */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ backgroundColor: "#1f2937", padding: "16px", borderRadius: "8px" }}>
            <h3 style={{ color: "#f3f4f6" }}>Rigid Rotor</h3>
            <Plot
              data={[
                // Quantum wave
                { x: quantumX, y: quantumY, type: "scatter", mode: "lines", line: { color: "#3b82f6", width: 3 }, name: "Quantum Wave" },
                // Classical particle
                showClassical && { x: [x_classical], y: [y_classical], type: "scatter", mode: "markers", marker: { size: 14, color: "#10b981" }, name: "Classical Particle" },
                // Circle outline
                { x: theta.map(th => R * Math.cos(th)), y: theta.map(th => R * Math.sin(th)), type: "scatter", mode: "lines", line: { color: "#f59e0b", width: 2 }, name: "Rotor Path" },
              ].filter(Boolean)}
              layout={{
                xaxis: { range: [-R - 1.5, R + 1.5], zeroline: false, fixedrange: true },
                yaxis: { range: [-R - 1.5, R + 1.5], scaleanchor: "x", zeroline: false, fixedrange: true },
                paper_bgcolor: "transparent",
                plot_bgcolor: "transparent",
                margin: { t: 30, l: 30, r: 30, b: 30 },
              }}
              style={{ width: "100%", height: "400px" }}
            />
          </div>
        </div>
      </div>

      {/* Controls and Equations */}
      <div style={{ display: "flex", gap: "24px", width: "100%" }}>
        <div style={{ flex: 1, minWidth: "300px", backgroundColor: "#111827", padding: "16px", borderRadius: "8px" }}>
          <h2 style={{ color: "#f3f4f6", marginBottom: "8px" }}>Current Parameters</h2>
          <label style={{ color: "#f3f4f6", fontWeight: "bold" }}>Angular Quantum Number (m): {m}</label>
          <input type="range" min="-10" max="10" value={m} onChange={e => setM(parseInt(e.target.value))} style={{ width: "100%", marginTop: "8px" }} />
          <div style={{ marginTop: "16px", color: "#d1d5db" }}>
            <p><InlineMath math={`\\psi_{${m}}(\\theta) = e^{i (${m}) \\theta}`} /></p>
            <p><InlineMath math={`E_{${m}} \\propto m^2`} /></p>
          </div>
          <div style={{ marginTop: "16px" }}>
            <label style={{ color: "#f3f4f6", fontWeight: "bold" }}>
              <input type="checkbox" checked={animate} onChange={e => setAnimate(e.target.checked)} /> Animate
            </label>
          </div>
          <div style={{ marginTop: "8px" }}>
            <label style={{ color: "#f3f4f6", fontWeight: "bold" }}>
              <input type="checkbox" checked={showClassical} onChange={e => setShowClassical(!showClassical)} /> Show Classical Rotor
            </label>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: "300px", backgroundColor: "#111827", padding: "16px", borderRadius: "8px" }}>
          <h2 style={{ color: "#f3f4f6", marginBottom: "8px" }}>General Equations</h2>
          <BlockMath math={String.raw`-\frac{\hbar^2}{2I} \frac{d^2}{d\theta^2} \psi = E \psi`} />
          <BlockMath math={String.raw`\psi_m(\theta) = \frac{1}{\sqrt{2\pi}} e^{i m \theta}`} />
          <BlockMath math={String.raw`E_m = \frac{\hbar^2 m^2}{2I}`} />
        </div>
      </div>
    </div>
  );
}
