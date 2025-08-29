import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

export default function ParticleInBox() {
  const [n, setN] = useState(1);
  const [animate, setAnimate] = useState(false);
  const [showClassical, setShowClassical] = useState(true);
  const [t, setT] = useState(0);
  const L = 1.0;

  useEffect(() => {
    if (!animate) return;
    const interval = setInterval(() => setT((prev) => prev + 0.01), 50);
    return () => clearInterval(interval);
  }, [animate]);

  const x = Array.from({ length: 200 }, (_, i) => (i / 199) * L);
  const E = (n ** 2 * Math.PI ** 2) / 2;

  // Quantum wavefunction
  const psiVals = animate
  ? x.map((xi) =>
      Math.sqrt(2 / L) *
      Math.sin((n * Math.PI * xi) / L) *
      Math.cos(E * t)
    )
  : x.map((xi) => Math.sqrt(2 / L) * Math.sin((n * Math.PI * xi) / L));

  // Probability density
  const probDensity = psiVals.map((v) => v ** 2);

  // Classical particle: bouncing between 0 and L
  const classicalPos =
    L * Math.abs(((t * Math.sqrt(2 * E)) % (2 * L)) - L); // simple linear bounce

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", gap: "24px" }}>
        {/* Vertical Heatmap */}
        <div style={{ width: "60px" }}>
          <Plot
            data={[
              {
                x: Array(x.length)
                  .fill(0)
                  .map(() => [0, 1, 2, 3]),
                y: x,
                z: probDensity.map((v) => Array(4).fill(v)),
                type: "heatmap",
                colorscale: "Viridis",
                showscale: false,
              },
            ]}
            layout={{
              margin: { t: 10, l: 10, r: 10, b: 10 },
              xaxis: { visible: false },
              yaxis: { range: [0, L], autorange: false, fixedrange: true },
              paper_bgcolor: "transparent",
              plot_bgcolor: "transparent",
            }}
            style={{ width: "60px", height: "400px" }}
          />
        </div>

        {/* Main ψ(x,t) plot */}
        <div style={{ flex: 1, backgroundColor: "#1f2937", padding: "16px", borderRadius: "8px" }}>
          <Plot
            data={[
              {
                x,
                y: psiVals,
                type: "scatter",
                mode: "lines",
                line: { color: "#3b82f6", width: 3 },
                name: "ψ(x,t)",
              },
              {
                x: [0, 0],
                y: [-1.5, 1.5],
                type: "scatter",
                mode: "lines",
                line: { color: "#f59e0b", width: 2 },
                showlegend: false,
              },
              {
                x: [L, L],
                y: [-1.5, 1.5],
                type: "scatter",
                mode: "lines",
                line: { color: "#f59e0b", width: 2 },
                showlegend: false,
              },
              showClassical && {
                x: [classicalPos],
                y: [0],
                type: "scatter",
                mode: "markers",
                marker: { size: 12, color: "#10b981" },
                name: "Classical",
              },
            ].filter(Boolean)}
            layout={{
              margin: { t: 30, l: 30, r: 30, b: 30 },
              xaxis: {
                range: [-0.1, 1.1],
                title: "x",
                gridcolor: "#374151",
                zeroline: false,
                fixedrange: true,
              },
              yaxis: {
                range: [-1.5, 1.5],
                title: "ψ(x,t)",
                gridcolor: "#374151",
                zeroline: false,
                fixedrange: true,
              },
              paper_bgcolor: "transparent",
              plot_bgcolor: "transparent",
            }}
            style={{ width: "100%", height: "400px" }}
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{ display: "flex", gap: "24px", width: "100%" }}>
        {/* Controls */}
        <div
          style={{
            flex: 1,
            minWidth: "300px",
            backgroundColor: "#111827",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          <h2 style={{ color: "#f3f4f6", marginBottom: "8px" }}>Current Parameters</h2>
          <label style={{ color: "#f3f4f6", fontWeight: "bold" }}>
            Quantum Number (n): {n}
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={n}
            onChange={(e) => setN(parseInt(e.target.value))}
            style={{ width: "100%", marginTop: "8px" }}
          />
          <div style={{ marginTop: "16px", color: "#d1d5db" }}>
            <p>
              <InlineMath math={`L = 1`} />
            </p>
            <p>
              <InlineMath
                math={`\\psi_{${n}}(x) = \\sqrt{2} \\sin(${n}\\pi x)`}
              />
            </p>
            <p>
              <InlineMath math={`E_{${n}} \\approx ${E.toFixed(2)}`} />
            </p>
          </div>
          <div style={{ marginTop: "16px" }}>
            <label style={{ color: "#f3f4f6", fontWeight: "bold" }}>
              <input
                type="checkbox"
                checked={animate}
                onChange={(e) => setAnimate(e.target.checked)}
              />{" "}
              Animate
            </label>
          </div>
          <div style={{ marginTop: "8px" }}>
            <label style={{ color: "#f3f4f6", fontWeight: "bold" }}>
              <input
                type="checkbox"
                checked={showClassical}
                onChange={() => setShowClassical(!showClassical)}
              />{" "}
              Show Classical Particle
            </label>
          </div>
        </div>

        {/* Equations */}
        <div
          style={{
            flex: 1,
            minWidth: "300px",
            backgroundColor: "#111827",
            padding: "16px",
            borderRadius: "8px",
          }}
        >
          <h2 style={{ color: "#f3f4f6", marginBottom: "8px" }}>General Equations</h2>
          <BlockMath
            math={String.raw`-\frac{\hbar^2}{2m} \frac{d^2}{dx^2} \psi = E \psi`}
          />
          <BlockMath
            math={String.raw`\psi_n(x) = \sqrt{\frac{2}{L}} \sin\!\left( \frac{n \pi x}{L} \right)`}
          />
          <BlockMath
            math={String.raw`E_n = \frac{n^2 \pi^2 \hbar^2}{2 m L^2}`}
          />
        </div>
      </div>
    </div>
  );
}
