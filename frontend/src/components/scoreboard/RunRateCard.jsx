import React from "react";

const RunRateCard = ({ runRate, requiredRunRate, target, currentRuns }) => {
  const requiredRuns = target ? target - currentRuns : null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <div className="stat-box">
        <p className="stat-value text-green-400">{runRate || "0.00"}</p>
        <p className="stat-label">Current RR</p>
      </div>

      {requiredRunRate && (
        <div className="stat-box">
          <p className="stat-value text-orange-400">{requiredRunRate}</p>
          <p className="stat-label">Required RR</p>
        </div>
      )}

      {target && (
        <div className="stat-box">
          <p className="stat-value text-amber-400">{target}</p>
          <p className="stat-label">Target</p>
        </div>
      )}

      {requiredRuns !== null && (
        <div className="stat-box">
          <p className="stat-value text-red-400">
            {requiredRuns > 0 ? requiredRuns : 0}
          </p>
          <p className="stat-label">Need</p>
        </div>
      )}
    </div>
  );
};

export default RunRateCard;