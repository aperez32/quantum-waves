import React from "react";

export default function Sidebar({ modules, active, setActive }) {
  return (
    <div
      className="h-screen flex flex-col"
      style={{ 
        width: '250px',
        backgroundColor: '#111827' // gray-900
      }}
    >
      {modules.map((module) => (
        <button
          key={module.key}
          onClick={() => setActive(module.key)}
          className="transition-all duration-300 relative"
          style={{
            width: '100%',
            padding: '32px 24px', // px-6 py-8
            textAlign: 'left',
            fontSize: '18px', // text-lg
            fontWeight: '500', // font-medium
            backgroundColor: active === module.key ? '#1f2937' : '#1d4ed8', // gray-800 : blue-700
            color: active === module.key ? '#f3f4f6' : '#ffffff', // gray-100 : white
            border: active === module.key ? '1px solid #374151' : '1px solid #000000', // gray-700 : black
            borderRight: active === module.key ? 'none' : '1px solid black',
            boxShadow: active === module.key ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)' : 'none',
            zIndex: active === module.key ? 10 : 1,
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            if (active !== module.key) {
              e.target.style.backgroundColor = '#2563eb'; // blue-600
            }
          }}
          onMouseLeave={(e) => {
            if (active !== module.key) {
              e.target.style.backgroundColor = '#1d4ed8'; // blue-700
            }
          }}
        >
          {module.label}
        </button>
      ))}
    </div>
  );
}