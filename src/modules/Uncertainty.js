// modules/Uncertainty.js
import React, { useState, useMemo } from "react";
import Plot from "react-plotly.js";
import FFT from "fft.js";
import { InlineMath } from 'react-katex';

const HBAR = 1; // set units so hbar=1 for simplicity

function generateGaussian(N, sigma) {
  const xVals = Array.from({ length: N }, (_, i) => (i - N / 2) / 10);
  const data = xVals.map(x => Math.exp(-(x*x)/(2*sigma*sigma)));
  return { xVals, data };
}

function computeFFT(values) {
  const N = values.length;
  const f = new FFT(N);
  const buffer = f.createComplexArray();
  const spectrum = new Array(N);

  f.realTransform(buffer, values);
  f.completeSpectrum(buffer);

  for (let i = 0; i < N; i++) {
    const re = buffer[2*i], im = buffer[2*i+1];
    spectrum[i] = Math.sqrt(re*re + im*im);
  }

  // shift negative frequencies to the left
  const half = N/2;
  return spectrum.slice(half).concat(spectrum.slice(0, half));
}

export default function Uncertainty() {
  const [funcType, setFuncType] = useState("Gaussian");
  const [sigmaX, setSigmaX] = useState(1);       // position-space width
  const [sigmaP, setSigmaP] = useState(HBAR/2); // momentum-space width

  // enforce sigma_x * sigma_p = hbar/2
  const handleSigmaX = (val) => {
    const newX = parseFloat(val);
    setSigmaX(newX);
    setSigmaP(HBAR/(2*newX));
  };

  const handleSigmaP = (val) => {
    const newP = parseFloat(val);
    setSigmaP(newP);
    setSigmaX(HBAR/(2*newP));
  };

  const N = 256;
  const { xVals, data } = useMemo(() => 
    funcType === "Gaussian" ? generateGaussian(N, sigmaX) : generateGaussian(N, 1), 
    [funcType, sigmaX]
  );

  const spectrum = useMemo(() => computeFFT(data), [data]);
  const kVals = Array.from({ length: N }, (_, i) => i - N/2);

  const CHART_W = 500;
  const CHART_H = 350;

  const layout = {
    paper_bgcolor: "#1f2937",
    plot_bgcolor: "#1f2937",
    font: { color: "#f3f4f6" },
    margin: { t: 30, l: 60, r: 30, b: 50 },
    xaxis: { gridcolor: "#444", zerolinecolor: "#444" },
    yaxis: { gridcolor: "#444", zerolinecolor: "#444", title: "Amplitude" },
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "24px", fontSize: "2rem" }}>
        Uncertainty & Fourier Transform
      </h1>

      <div style={{ maxWidth: "800px", margin: "0 auto 16px auto", textAlign: "center" }}>
        <p>
          The Fourier transform expresses a function in terms of its wave frequencies. For <InlineMath math="f(x)" />, 
          <InlineMath math="\hat{f}(\xi) = \int_{-\infty}^{\infty} f(x) e^{i 2 \pi \xi x} dx" />. 
          Momentum is proportional to frequency: <InlineMath math="p = \hbar k" />. 
          Narrowing a wavefunction in position space increases its spread in momentum space and vice versa.
        </p>
      </div>

      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <label style={{ marginRight: "12px" }}>Function:</label>
        <select
          style={{ padding: "6px 10px", borderRadius: "6px", backgroundColor: "#111827", color: "#f3f4f6" }}
          value={funcType}
          onChange={(e) => setFuncType(e.target.value)}
        >
          <option>Gaussian</option>
        </select>

        {funcType === "Gaussian" && (
          <span style={{ marginLeft: "20px" }}>
            <label>σ<sub>x</sub> (position): {sigmaX.toFixed(2)}</label>
            <input
              type="range"
              min="0.1" max="5" step="0.1"
              value={sigmaX}
              onChange={(e) => handleSigmaX(e.target.value)}
              style={{ marginLeft: "8px" }}
            />
            <label style={{ marginLeft: "20px" }}>σ<sub>p</sub> (momentum): {sigmaP.toFixed(2)}</label>
            <input
              type="range"
              min="0.1" max="5" step="0.05"
              value={sigmaP}
              onChange={(e) => handleSigmaP(e.target.value)}
              style={{ marginLeft: "8px" }}
            />
          </span>
        )}
      </div>

      <div style={{ display: "inline-block", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-block", verticalAlign: "top" }}>
          <h3 style={{ textAlign: "center" }}>Function (x-space)</h3>
          <Plot
            data={[{ x: xVals, y: data, type: "scatter", mode: "lines", line: { color: "#82ca9d" } }]}
            layout={{ ...layout, width: CHART_W, height: CHART_H, xaxis: { ...layout.xaxis, title: "x" } }}
          />
        </div>

        <div style={{ display: "inline-block", width: "60px", textAlign: "center", fontSize: "2rem", verticalAlign: "middle" }}>↔</div>

        <div style={{ display: "inline-block", verticalAlign: "top" }}>
          <h3 style={{ textAlign: "center" }}>Fourier (p-space)</h3>
          <Plot
            data={[{ x: kVals, y: spectrum, type: "scatter", mode: "lines", line: { color: "#8884d8" } }]}
            layout={{ ...layout, width: CHART_W, height: CHART_H, xaxis: { ...layout.xaxis, title: "p" } }}
          />
        </div>
      </div>
    </div>
  );
}
