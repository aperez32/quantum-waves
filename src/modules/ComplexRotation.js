// modules/ComplexRotation.js
import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

export default function ComplexRotation() {
  const [animate, setAnimate] = useState(true);
  const [mode, setMode] = useState("QHO"); // QHO, RigidRotor, Wavelet
  const [n, setN] = useState(3);
  const controlsRef = useRef();

  return (
    <div style={{ width: "100%", height: "700px" }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <WaveVisualizer mode={mode} n={n} animate={animate} />
        <Axes />
        <OrbitControls ref={controlsRef} />
      </Canvas>

      <div style={{ marginTop: "12px", textAlign: "center" }}>
        <button
          onClick={() => setAnimate((prev) => !prev)}
          style={{ padding: "8px 16px", borderRadius: "8px", backgroundColor: "#4F46E5", color: "#fff", marginRight: "12px" }}
        >
          {animate ? "Pause" : "Play"}
        </button>

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

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          style={{ marginLeft: "12px", padding: "4px 8px", borderRadius: "6px" }}
        >
          <option value="QHO">QHO</option>
          <option value="RigidRotor">Rigid Rotor</option>
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
          style={{ padding: "8px 16px", borderRadius: "8px", backgroundColor: "#10B981", color: "#fff", marginLeft: "12px" }}
        >
          Look Along Imag Axis
        </button>
      </div>
    </div>
  );
}

function WaveVisualizer({ mode, n, animate }) {
  const lineRef = useRef();
  const tRef = useRef(0);
  const N = 200;

  const radius = 1.5; // rigid rotor radius
  const L = 1.0; // QHO/Box length
  const xArray = useMemo(() => Array.from({ length: N }, (_, i) => i / (N - 1)), [N]);
  const thetaArray = useMemo(() => Array.from({ length: N }, (_, i) => (i / N) * 2 * Math.PI), [N]);

  // Wavefunction depending on mode
  const psi = (xi, i) => {
    if (mode === "QHO") return Math.sqrt(2 / L) * Math.sin((n * Math.PI * xi) / L);
    if (mode === "RigidRotor") return Math.sqrt(2) * Math.sin(n * thetaArray[i]);
    if (mode === "Wavelet") return Math.exp(-5 * (xi - 0.5) ** 2) * Math.sin(20 * xi); 
    return 0;
  };

  const positions = useMemo(() => new Float32Array(N * 3), [N]);

  useFrame(() => {
    if (!lineRef.current) return;
    if (animate) tRef.current += 0.05;
    const t = tRef.current;

    for (let i = 0; i < N; i++) {
      if (mode === "RigidRotor") {
        const theta = thetaArray[i] + t * 0.5; // rotate circle
        positions[i * 3 + 0] = radius * Math.cos(theta); // X
        positions[i * 3 + 1] = radius * Math.sin(theta); // Y
        positions[i * 3 + 2] = psi(null, i) * Math.cos(t); // Z wavefunction
      } else if (mode === "QHO" || mode === "Wavelet") {
        const xi = xArray[i];
        positions[i * 3 + 0] = xi * 4 - 2; // X from -2 to 2
        positions[i * 3 + 1] = psi(xi, i) * Math.cos(t); // Y
        positions[i * 3 + 2] = -psi(xi, i) * Math.sin(t); // Z
      }
    }

    lineRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute attach="attributes-position" count={N} array={positions} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial attach="material" color="#4F46E5" linewidth={4} />
    </line>
  );
}

function Axes() {
  const axes = [
    { dir: [2.5, 0, 0], color: "#f59e0b", label: "X" },
    { dir: [0, 2.5, 0], color: "#10b981", label: "Y" },
    { dir: [0, 0, 2.5], color: "#6366f1", label: "Z" },
  ];
  return axes.map((axis, i) => (
    <group key={i}>
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute attach="attributes-position" array={new Float32Array([0, 0, 0, ...axis.dir])} count={2} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color={axis.color} linewidth={2} />
      </line>
      <Text position={axis.dir.map((v) => v * 1.05)} fontSize={0.1} color={axis.color} anchorX="center" anchorY="middle">
        {axis.label}
      </Text>
    </group>
  ));
}
