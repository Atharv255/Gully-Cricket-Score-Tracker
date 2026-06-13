import React from "react";

const LastWicketCard = ({ lastWicket }) => {
  if (!lastWicket?.playerName) return null;

  return (
    <div className="bg-red-950/20 border border-red-900/20 rounded-xl p-3 mb-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-red-500/70 mb-2">
        Last Wicket
      </h3>
      <div className="flex items-center gap-3">
        <span className="text-2xl">🏏</span>
        <div>
          <p className="text-sm font-bold text-red-300">
            {lastWicket.playerName}{" "}
            <span className="text-white">
              {lastWicket.runs}({lastWicket.balls}b)
            </span>
          </p>
          {lastWicket.dismissalInfo && (
            <p className="text-xs text-gray-400">{lastWicket.dismissalInfo}</p>
          )}
          {lastWicket.totalScoreAtFall && (
            <p className="text-xs text-gray-600">
              Score at fall: {lastWicket.totalScoreAtFall} | Over: {lastWicket.overAtFall}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LastWicketCard;