import React from "react";

const PartnershipCard = ({ partnership, lastWicket }) => {
  return (
    <div className="card mb-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Partnership */}
        {partnership && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Partnership
            </h3>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-xl font-bold text-white font-mono">
                {partnership.runs}
                <span className="text-sm text-gray-400 font-normal ml-1">
                  ({partnership.balls}b)
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {partnership.balls > 0
                  ? `${((partnership.runs / partnership.balls) * 6).toFixed(2)} RPO`
                  : "0.00 RPO"}
              </p>
            </div>
          </div>
        )}

        {/* Last Wicket */}
        {lastWicket?.playerName && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Last Wicket
            </h3>
            <div className="bg-red-950/30 border border-red-900/30 rounded-lg p-3">
              <p className="text-sm font-bold text-red-300 truncate">
                {lastWicket.playerName}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {lastWicket.runs}({lastWicket.balls}b)
              </p>
              {lastWicket.dismissalInfo && (
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {lastWicket.dismissalInfo}
                </p>
              )}
              {lastWicket.totalScoreAtFall && (
                <p className="text-xs text-gray-600 mt-0.5">
                  at {lastWicket.totalScoreAtFall} ({lastWicket.overAtFall} ov)
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnershipCard;