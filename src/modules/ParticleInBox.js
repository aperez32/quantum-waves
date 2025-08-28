import React, { useState } from "react";
import Plot from "react-plotly.js";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

export default function ParticleInBox() {
  const [n, setN] = useState(1);
  const L = 1.0;
  const x = Array.from({ length: 200 }, (_, i) => (i / 199) * L);
  const psi = x.map((xi) => Math.sqrt(2 / L) * Math.sin((n * Math.PI * xi) / L));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Particle in a Box</h1>
      <BlockMath math={"-\\frac{\\hbar^2}{2m} \\frac{d^2}{dx^2} \\psi= E \\psi"} />
      <BlockMath math={`\\psi_n(x) = \\sqrt{\\tfrac{2}{L}} \\sin\\!\\left( \\tfrac{n\\pi x}{L} \\right)`} />

      <div className="my-4">
        <label className="block mb-2 font-semibold">Quantum Number (n): {n}</label>
        <input
          type="range"
          min="1"
          max="5"
          value={n}
          onChange={(e) => setN(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <Plot
        data={[
          { x: x, y: psi, type: "scatter", mode: "lines", line: { color: "blue" } },
        ]}
        layout={{
          title: `Wavefunction for n = ${n}`,
          xaxis: { title: "x (position)" },
          yaxis: { title: "ψ(x)" },
          margin: { t: 40, r: 20, l: 50, b: 50 },
        }}
        style={{ width: "100%", height: "500px" }}
      />
    </div>
  );
}
