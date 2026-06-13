import React from "react";

const MatchResultBanner = ({ result }) => {
  if (!result?.description) return null;

  return (
    <div className="bg-gradient-to-r from-cricket-green/20 to-cricket-darkgreen/20 border border-cricket-green/40 rounded-xl p-5 text-center mb-4 animate-bounce-in">
      <div className="text-3xl mb-2">🏆</div>
      <h2 className="text-xl font-black text-white mb-1">
        {result.description}
      </h2>
      {result.manOfTheMatch?.playerName && (
        <div className="mt-3 inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-1.5">
          <span className="text-amber-400 text-sm">⭐</span>
          <span className="text-amber-300 text-sm font-semibold">
            Man of the Match: {result.manOfTheMatch.playerName}
          </span>
          {result.manOfTheMatch.teamName && (
            <span className="text-amber-500 text-xs">
              ({result.manOfTheMatch.teamName})
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchResultBanner;