import React, { useState } from "react";
import Sidebar from "./sidebar";
import ParticleInBox from "./modules/ParticleInBox";

export default function App() {
  const [active, setActive] = useState("intro");
  
  const modules = [
    { 
      key: "intro", 
      label: "Introduction"
    },
    { 
      key: "box", 
      label: "Particle in a Box"
    },
    { 
      key: "oscillator", 
      label: "Harmonic Oscillator"
    },
    { 
      key: "complex", 
      label: "Complex Wavefunctions"
    },
  ];

  const renderContent = () => {
    switch (active) {
      case "intro":
        return (
          <div className="max-w-4xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-100 mb-4">
                Quantum Mechanics Visualizations
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                Explore the fundamental concepts of quantum mechanics through interactive visualizations.
                These modules demonstrate key quantum systems and their mathematical foundations.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-900 p-6 rounded-lg border border-blue-800">
                <h3 className="text-xl font-semibold text-blue-100 mb-3">📦 Particle in a Box</h3>
                <p className="text-blue-200">
                  Visualize energy levels and wavefunctions for a particle confined in an infinite potential well.
                  Explore how quantum confinement leads to discrete energy states.
                </p>
              </div>
              
              <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                <h3 className="text-xl font-semibold text-gray-200 mb-3">🌊 Harmonic Oscillator</h3>
                <p className="text-gray-300">
                  Coming soon: Explore the quantum harmonic oscillator and its energy eigenstates.
                  Watch how the classical spring system transforms in the quantum realm.
                </p>
              </div>
              
              <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                <h3 className="text-xl font-semibold text-gray-200 mb-3">🔄 Complex Wavefunctions</h3>
                <p className="text-gray-300">
                  Coming soon: Watch wavefunctions rotate in the complex plane over time.
                  Visualize the phase evolution of quantum states.
                </p>
              </div>
            </div>

            <div className="mt-8 bg-amber-900 p-6 rounded-lg border border-amber-800">
              <h3 className="text-lg font-semibold text-amber-200 mb-2">Getting Started</h3>
              <p className="text-amber-300">
                Click on any module tab to begin exploring. Each visualization includes 
                interactive controls to adjust parameters and observe quantum behavior.
              </p>
            </div>
          </div>
        );
        
      case "box":
        return <ParticleInBox />;
        
      case "oscillator":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="text-8xl mb-6">🌊</div>
              <h2 className="text-3xl font-bold text-gray-100 mb-4">Harmonic Oscillator</h2>
              <p className="text-gray-300 text-lg">
                This module is currently under development. Check back soon for interactive 
                visualizations of the quantum harmonic oscillator!
              </p>
            </div>
          </div>
        );
        
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
      {/* Sidebar Component */}
      <Sidebar modules={modules} active={active} setActive={setActive} />

      {/* Content Column */}
      <div 
        className="shadow-inner overflow-auto" 
        style={{ 
          borderLeft: 'none',
          backgroundColor: '#1f2937', /* gray-800 */
          minHeight: '100vh'
        }}
      >
        <div 
          className="p-8 h-full"
          style={{
            backgroundColor: '#1f2937', /* gray-800 */
            color: '#f3f4f6' /* gray-100 */
          }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}