import React, { useEffect, useRef } from "react";

const TeamScore = ({
  innings,
  isCurrentInnings = true,
  totalPlayers = 11,
  totalOvers = null,
}) => {
  const scoreRef = useRef(null);
  const prevScore = useRef(innings?.totalRuns);

  useEffect(() => {
    if (innings?.totalRuns !== prevScore.current && scoreRef.current) {
      scoreRef.current.classList.add("animate-score-pop");
      const timer = setTimeout(() => {
        scoreRef.current?.classList.remove("animate-score-pop");
      }, 400);
      prevScore.current = innings?.totalRuns;
      return () => clearTimeout(timer);
    }
  }, [innings?.totalRuns]);

  if (!innings) return null;

  const {
    battingTeam,
    totalRuns,
    wickets,
    overs,
    runRate,
    target,
    requiredRuns,
    requiredRunRate,
    inningsNumber,
  } = innings;

  // Calculate max wickets based on team size
  const teamSize = totalPlayers || innings?.batters?.length || 11;
  const maxWickets = Math.max(1, teamSize - 1);
  const wicketsLeft = maxWickets - wickets;

  // Get total overs from props or innings
  const matchTotalOvers = totalOvers || innings?.totalOvers || 0;

  return (
    <div className="bg-gradient-to-br from-cricket-green/20 to-cricket-darkgreen/10 border border-cricket-green/30 rounded-xl p-4 mb-4">
      {/* Innings Label */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {inningsNumber === 1 ? "1st Innings" : "2nd Innings"}
        </span>
        {isCurrentInnings && (
          <span className="text-xs text-cricket-green font-semibold">
            ● Batting Now
          </span>
        )}
      </div>

      {/* Team Name */}
      <h2 className="text-base font-bold text-white mb-3">{battingTeam}</h2>

      {/* Main Score */}
      <div className="flex items-baseline gap-3 mb-4">
        <div ref={scoreRef} className="transition-transform duration-200">
          <span className="text-5xl font-black text-white font-mono">
            {totalRuns}
          </span>
          <span className="text-3xl font-bold text-gray-400 font-mono">
            /{wickets}
          </span>
        </div>
        <div className="text-right ml-auto">
          <p className="text-xl font-bold text-gray-300 font-mono">
            {overs}
            {matchTotalOvers > 0 && (
              <span className="text-sm text-gray-500 font-normal ml-1">
                / {matchTotalOvers}
              </span>
            )}
          </p>
          <p className="text-xs text-gray-500">Overs</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="stat-box">
          <p className="stat-value text-lg">{runRate}</p>
          <p className="stat-label">Run Rate</p>
        </div>

        {target && (
          <>
            <div className="stat-box">
              <p className="stat-value text-lg text-amber-400">{target}</p>
              <p className="stat-label">Target</p>
            </div>
            <div className="stat-box">
              <p className="stat-value text-lg text-red-400">
                {requiredRuns > 0 ? requiredRuns : 0}
              </p>
              <p className="stat-label">Need</p>
            </div>
            <div className="stat-box">
              <p className="stat-value text-lg text-orange-400">
                {requiredRunRate || "0.00"}
              </p>
              <p className="stat-label">Req. RR</p>
            </div>
          </>
        )}

        {!target && (
          <div className="stat-box col-span-1">
            <p className="stat-value text-lg text-blue-400">
              {wickets >= maxWickets ? "All Out" : `${wicketsLeft} left`}
            </p>
            <p className="stat-label">Wickets</p>
          </div>
        )}
      </div>

      {/* Match Info Indicator */}
      {(teamSize < 11 || matchTotalOvers > 0) && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          {teamSize < 11 && (
            <span>
              Team Size: {teamSize} · Max Wickets: {maxWickets}
            </span>
          )}
          {teamSize < 11 && matchTotalOvers > 0 && <span> · </span>}
          {matchTotalOvers > 0 && <span>Match: {matchTotalOvers} Overs</span>}
        </div>
      )}
    </div>
  );
};

export default TeamScore;