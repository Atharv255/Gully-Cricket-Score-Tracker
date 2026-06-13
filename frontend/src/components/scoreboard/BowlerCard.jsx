import React from "react";

const BowlerCard = ({ bowler }) => {
  if (!bowler) return null;

  return (
    <div className="card mb-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
        Current Bowler
      </h3>

      <div className="flex items-center gap-3 py-2 px-3 bg-gray-800/50 rounded-lg">
        <div className="flex-shrink-0">
          <span className="text-lg">⚾</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {bowler.playerName}
          </p>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div className="text-center">
            <p className="text-sm font-bold text-white font-mono">
              {bowler.overs}
            </p>
            <p className="text-xs text-gray-500">O</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-300 font-mono">
              {bowler.maidens}
            </p>
            <p className="text-xs text-gray-500">M</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-amber-400 font-mono">
              {bowler.runs}
            </p>
            <p className="text-xs text-gray-500">R</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-red-400 font-mono">
              {bowler.wickets}
            </p>
            <p className="text-xs text-gray-500">W</p>
          </div>
          <div className="text-center hidden sm:block">
            <p className="text-sm font-semibold text-orange-400 font-mono">
              {bowler.economy}
            </p>
            <p className="text-xs text-gray-500">Eco</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BowlerCard;