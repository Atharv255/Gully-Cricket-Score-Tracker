import React from "react";

const WagonWheel = ({ shots = [] }) => {
  const centerX = 150;
  const centerY = 150;
  const radius = 120;

  const getColor = (runs) => {
    if (runs === 6) return "#7c3aed";
    if (runs === 4) return "#2563eb";
    if (runs === 0) return "#374151";
    return "#1a7a4a";
  };

  const generateShots = () => {
    if (shots.length === 0) {
      const demoShots = [];
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const r = Math.random() * radius;
        const runs = [0, 1, 2, 4, 6][Math.floor(Math.random() * 5)];
        demoShots.push({
          x: centerX + r * Math.cos(angle),
          y: centerY + r * Math.sin(angle),
          runs,
        });
      }
      return demoShots;
    }
    return shots.map((shot) => ({
      x: centerX + shot.distance * Math.cos((shot.angle * Math.PI) / 180),
      y: centerY + shot.distance * Math.sin((shot.angle * Math.PI) / 180),
      runs: shot.runs,
    }));
  };

  const plotShots = generateShots();

  return (
    <div className="card">
      <h3 className="text-sm font-bold text-gray-400 mb-4">Wagon Wheel</h3>
      <div className="flex justify-center">
        <svg width="300" height="300" viewBox="0 0 300 300">
          {/* Field */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="#0f2d1a"
            stroke="#1a7a4a"
            strokeWidth="1"
          />

          {/* Inner circle (30 yard) */}
          <circle
            cx={centerX}
            cy={centerY}
            r={60}
            fill="none"
            stroke="#1a7a4a"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />

          {/* Pitch */}
          <rect
            x={centerX - 8}
            y={centerY - 20}
            width={16}
            height={40}
            fill="#c8a96e"
            rx="2"
          />

          {/* Zone lines */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <line
                key={angle}
                x1={centerX}
                y1={centerY}
                x2={centerX + radius * Math.cos(rad)}
                y2={centerY + radius * Math.sin(rad)}
                stroke="#1a7a4a"
                strokeWidth="0.5"
                opacity="0.5"
              />
            );
          })}

          {/* Shots */}
          {plotShots.map((shot, index) => (
            <g key={index}>
              <line
                x1={centerX}
                y1={centerY}
                x2={shot.x}
                y2={shot.y}
                stroke={getColor(shot.runs)}
                strokeWidth="1.5"
                opacity="0.7"
              />
              <circle
                cx={shot.x}
                cy={shot.y}
                r="4"
                fill={getColor(shot.runs)}
                opacity="0.9"
              />
            </g>
          ))}

          {/* Stumps */}
          <circle
            cx={centerX}
            cy={centerY}
            r="4"
            fill="#c8a96e"
          />
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3">
        {[
          { color: "#7c3aed", label: "6" },
          { color: "#2563eb", label: "4" },
          { color: "#1a7a4a", label: "1-3" },
          { color: "#374151", label: "Dot" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-500">{item.label}</span>
          </div>
        ))}
      </div>

      {shots.length === 0 && (
        <p className="text-xs text-gray-600 text-center mt-2">
          Demo visualization - Live data when match starts
        </p>
      )}
    </div>
  );
};

export default WagonWheel;