// modules/ComplexRotation.js
import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { InlineMath } from 'react-katex';

export default function ComplexRotation() {
  const [animate, setAnimate] = useState(true);
  const [mode, setMode] = useState("PIB"); // PIB, Wavelet
  const [n, setN] = useState(3);
  const [k0, setK0] = useState(20); // wavelet momentum (carrier wavenumber)
  const controlsRef = useRef();

  return (
    <div style={{ width: "100%", height: "850px", display: "flex", flexDirection: "column" }}>
      {/* Controls on top */}
      <div style={{ marginBottom: "12px", textAlign: "center" }}>
        <button
          onClick={() => setAnimate((prev) => !prev)}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            backgroundColor: "#4F46E5",
            color: "#fff",
            marginRight: "12px",
          }}
        >
          {animate ? "Pause" : "Play"}
        </button>

        {mode === "PIB" && (
          <label style={{ color: "#f3f4f6", marginLeft: "12px" }}>
            Quantum Number n: {n}
            <input
              type="range"
              min="1"
              max="20"
              value={n}
              onChange={(e) => setN(parseInt(e.target.value))}
              style={{ marginLeft: "8px" }}
            />
          </label>
        )}

        {mode === "Wavelet" && (
          <label style={{ color: "#f3f4f6", marginLeft: "12px" }}>
            Momentum k₀: {k0}
            <input
              type="range"
              min="5"
              max="50"
              value={k0}
              onChange={(e) => setK0(parseInt(e.target.value))}
              style={{ marginLeft: "8px" }}
            />
          </label>
        )}

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          style={{ marginLeft: "12px", padding: "4px 8px", borderRadius: "6px" }}
        >
          <option value="PIB">PIB</option>
          <option value="Wavelet">Wavelet</option>
        </select>

        <button
          onClick={() => {
            if (controlsRef.current) {
              const cam = controlsRef.current.object;
              cam.position.set(0, 0, 6);
              controlsRef.current.target.set(0, 0, 0);
              controlsRef.current.update();
            }
          }}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            backgroundColor: "#10B981",
            color: "#fff",
            marginLeft: "12px",
          }}
        >
          Look Along Imag Axis
        </button>
      </div>

      {/* Description area */}
      <div style={{ textAlign: "center", color: "#e5e7eb", marginBottom: "16px", maxWidth: "800px", marginInline: "auto" }}>
        {mode === "PIB" && (
          <p className="text-lg leading-relaxed">
            The <b>Particle in a Box</b> stationary states are sinusoidal standing waves.  
            When promoted to full time-dependent solutions, they acquire a global phase factor  
            <InlineMath math="\ e^{-iEt / \hbar}" />.  
            This corresponds to a uniform rotation in the complex plane, leaving the probability density unchanged:  
            <InlineMath math="|\psi(x,t)|^2 = |\psi_n(x)|^2" />.
          </p>        
        )}
        {mode === "Wavelet" && (
          <p>
            This mode shows a localized Gaussian-modulated <b>wavelet packet</b> rotating in the complex plane.  
            You can adjust the central momentum <InlineMath math="k_0" /> with the slider to see how the carrier frequency changes.
          </p>
        )}
      </div>

      {/* 3D canvas */}
      <div style={{ flex: 1 }}>
        <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <WaveVisualizer mode={mode} n={n} k0={k0} animate={animate} />
          <Axes />
          <OrbitControls ref={controlsRef} />
        </Canvas>
      </div>
    </div>
  );
}

function WaveVisualizer({ mode, n, k0, animate }) {
  const lineRef = useRef();
  const tRef = useRef(0);
  const N = 200;

  const L = 1.0;
  const xArray = useMemo(() => Array.from({ length: N }, (_, i) => i / (N - 1)), [N]);

  const psi = (xi) => {
    if (mode === "PIB") return Math.sqrt(2 / L) * Math.sin((n * Math.PI * xi) / L);
    if (mode === "Wavelet") return Math.exp(-5 * (xi - 0.5) ** 2) * Math.sin(k0 * xi);
    return 0;
  };

  const positions = useMemo(() => new Float32Array(N * 3), [N]);

  useFrame(() => {
    if (!lineRef.current) return;
    if (animate) tRef.current += 0.05;
    const t = tRef.current;

    for (let i = 0; i < N; i++) {
      const xi = xArray[i];
      positions[i * 3 + 0] = xi * 4 - 2; // X axis
      positions[i * 3 + 1] = psi(xi) * Math.cos(t); // Re(psi)
      positions[i * 3 + 2] = -psi(xi) * Math.sin(t); // Im(psi)
    }

    lineRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={N}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial attach="material" color="#4F46E5" linewidth={4} />
    </line>
  );
}

function Axes() {
  const axes = [
    { dir: [2.5, 0, 0], color: "#f59e0b", label: "X" },
    { dir: [0, 2.5, 0], color: "#10b981", label: "Re" },
    { dir: [0, 0, 2.5], color: "#6366f1", label: "Im" },
  ];
  return axes.map((axis, i) => (
    <group key={i}>
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([0, 0, 0, ...axis.dir])}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color={axis.color} linewidth={2} />
      </line>
      <Text
        position={axis.dir.map((v) => v * 1.05)}
        fontSize={0.1}
        color={axis.color}
        anchorX="center"
        anchorY="middle"
      >
        {axis.label}
      </Text>
    </group>
  ));
}
