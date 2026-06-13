import React from "react";
import { formatStrikeRate } from "../../utils/formatters";

const BatterRow = ({ batter, isStriker }) => {
  if (!batter) return null;

  return (
    <div
      className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${
        isStriker ? "bg-cricket-green/10 border border-cricket-green/20" : ""
      }`}
    >
      {/* Strike indicator */}
      <div className="w-5 flex-shrink-0">
        {isStriker ? (
          <span className="text-cricket-green font-bold text-sm">🏏</span>
        ) : (
          <span className="text-gray-600 text-sm">○</span>
        )}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">
          {batter.playerName}
          {isStriker && (
            <span className="ml-2 text-xs text-cricket-green">*</span>
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-right">
        <div className="text-center">
          <p className="text-base font-bold text-white font-mono">
            {batter.runs}
          </p>
          <p className="text-xs text-gray-500">R</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-300 font-mono">
            {batter.balls}
          </p>
          <p className="text-xs text-gray-500">B</p>
        </div>
        <div className="text-center hidden sm:block">
          <p className="text-sm font-semibold text-blue-400 font-mono">
            {batter.fours}
          </p>
          <p className="text-xs text-gray-500">4s</p>
        </div>
        <div className="text-center hidden sm:block">
          <p className="text-sm font-semibold text-purple-400 font-mono">
            {batter.sixes}
          </p>
          <p className="text-xs text-gray-500">6s</p>
        </div>
        <div className="text-center hidden md:block">
          <p className="text-sm font-semibold text-amber-400 font-mono">
            {formatStrikeRate(batter.runs, batter.balls)}
          </p>
          <p className="text-xs text-gray-500">SR</p>
        </div>
      </div>
    </div>
  );
};

const BatsmanCard = ({ striker, nonStriker }) => {
  // Only show batters who are currently batting (not out)
  const showStriker = striker && striker.status !== "out";
  const showNonStriker = nonStriker && nonStriker.status !== "out";

  return (
    <div className="card mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Batsmen
        </h3>
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span>R</span>
          <span>B</span>
          <span className="hidden sm:block">4s</span>
          <span className="hidden sm:block">6s</span>
          <span className="hidden md:block">SR</span>
        </div>
      </div>

      {/* Batters */}
      <div className="space-y-1">
        {showStriker ? (
          <BatterRow batter={striker} isStriker={true} />
        ) : (
          <div className="py-2 px-3 bg-amber-950/20 border border-amber-900/30 rounded-lg">
            <p className="text-xs text-amber-400 text-center">
              ⚠️ Please select new batsman
            </p>
          </div>
        )}

        {showNonStriker ? (
          <BatterRow batter={nonStriker} isStriker={false} />
        ) : (
          <div className="py-2 px-3 bg-amber-950/20 border border-amber-900/30 rounded-lg">
            <p className="text-xs text-amber-400 text-center">
              ⚠️ Non-striker pending
            </p>
          </div>
        )}
      </div>

      {!showStriker && !showNonStriker && (
        <p className="text-center text-gray-600 text-sm py-4">
          No batsmen at the crease
        </p>
      )}
    </div>
  );
};

export default BatsmanCard;