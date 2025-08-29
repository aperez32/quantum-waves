import React, { useState } from "react";
import Sidebar from "./sidebar";
import ParticleInBox from "./modules/ParticleInBox";
import QHO from "./modules/QHO";
import RigidRotor from "./modules/RigidRotor"; // 👈 import rotor

export default function App() {
  const [active, setActive] = useState("intro");
  
  const modules = [
    { key: "intro", label: "Introduction" },
    { key: "box", label: "Particle in a Box" },
    { key: "oscillator", label: "Harmonic Oscillator" },
    { key: "rotor", label: "Rigid Rotor" },   // 👈 rotor tab
    { key: "complex", label: "Complex Wavefunctions" },
  ];

  const renderContent = () => {
    switch (active) {
      case "intro":
        return (
          <div className="max-w-4xl">
            {/* ... intro content unchanged ... */}
          </div>
        );
        
      case "box":
        return <ParticleInBox />;
        
      case "oscillator":
        return <QHO />; 
        
      case "rotor":                          // 👈 render rotor visualization
        return <RigidRotor />; 
        
      case "complex":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="text-8xl mb-6">🔄</div>
              <h2 className="text-3xl font-bold text-gray-100 mb-4">Complex Wavefunctions</h2>
              <p className="text-gray-300 text-lg">
                Coming soon: Watch quantum wavefunctions evolve and rotate in the complex plane.
              </p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div 
      className="h-screen bg-gray-900"
      style={{
        display: 'grid',
        gridTemplateColumns: '250px 1fr',
        gridTemplateRows: '1fr'
      }}
    >
      <Sidebar modules={modules} active={active} setActive={setActive} />

      <div 
        className="shadow-inner overflow-auto" 
        style={{ 
          borderLeft: 'none',
          backgroundColor: '#1f2937',
          minHeight: '100vh'
        }}
      >
        <div 
          className="p-8 h-full"
          style={{
            backgroundColor: '#1f2937',
            color: '#f3f4f6'
          }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
