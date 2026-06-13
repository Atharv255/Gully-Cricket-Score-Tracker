import React, { useState } from "react";
import { formatStrikeRate, formatEconomy } from "../../utils/formatters";

const BattingTable = ({ batters = [] }) => {
  const batted = batters.filter((b) => b.status !== "yet_to_bat");

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="text-left text-xs text-gray-500 font-semibold py-2 pr-3 min-w-[120px]">
              Batter
            </th>
            <th className="text-left text-xs text-gray-500 font-semibold py-2 pr-3 min-w-[100px]">
              Dismissal
            </th>
            <th className="text-right text-xs text-gray-500 font-semibold py-2 px-2">
              R
            </th>
            <th className="text-right text-xs text-gray-500 font-semibold py-2 px-2">
              B
            </th>
            <th className="text-right text-xs text-gray-500 font-semibold py-2 px-2">
              4s
            </th>
            <th className="text-right text-xs text-gray-500 font-semibold py-2 px-2">
              6s
            </th>
            <th className="text-right text-xs text-gray-500 font-semibold py-2 pl-2">
              SR
            </th>
          </tr>
        </thead>
        <tbody>
          {batted.map((batter, index) => (
            <tr
              key={index}
              className="border-b border-gray-800/50 hover:bg-gray-800/20"
            >
              <td className="py-2.5 pr-3">
                <p className="font-semibold text-white">{batter.playerName}</p>
              </td>
              <td className="py-2.5 pr-3">
                <p className="text-xs text-gray-400">
                  {batter.status === "batting"
                    ? "not out"
                    : batter.dismissalInfo || "out"}
                </p>
              </td>
              <td className="py-2.5 px-2 text-right font-bold text-white font-mono">
                {batter.runs}
              </td>
              <td className="py-2.5 px-2 text-right text-gray-300 font-mono">
                {batter.balls}
              </td>
              <td className="py-2.5 px-2 text-right text-blue-400 font-mono">
                {batter.fours}
              </td>
              <td className="py-2.5 px-2 text-right text-purple-400 font-mono">
                {batter.sixes}
              </td>
              <td className="py-2.5 pl-2 text-right text-amber-400 font-mono text-xs">
                {formatStrikeRate(batter.runs, batter.balls)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const BowlingTable = ({ bowlers = [] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="text-left text-xs text-gray-500 font-semibold py-2 pr-3 min-w-[120px]">
              Bowler
            </th>
            <th className="text-right text-xs text-gray-500 font-semibold py-2 px-2">
              O
            </th>
            <th className="text-right text-xs text-gray-500 font-semibold py-2 px-2">
              M
            </th>
            <th className="text-right text-xs text-gray-500 font-semibold py-2 px-2">
              R
            </th>
            <th className="text-right text-xs text-gray-500 font-semibold py-2 px-2">
              W
            </th>
            <th className="text-right text-xs text-gray-500 font-semibold py-2 pl-2">
              Eco
            </th>
          </tr>
        </thead>
        <tbody>
          {bowlers.map((bowler, index) => (
            <tr
              key={index}
              className="border-b border-gray-800/50 hover:bg-gray-800/20"
            >
              <td className="py-2.5 pr-3 font-semibold text-white">
                {bowler.playerName}
              </td>
              <td className="py-2.5 px-2 text-right text-gray-300 font-mono">
                {bowler.overs}.{bowler.balls || 0}
              </td>
              <td className="py-2.5 px-2 text-right text-gray-300 font-mono">
                {bowler.maidens}
              </td>
              <td className="py-2.5 px-2 text-right text-amber-400 font-mono">
                {bowler.runs}
              </td>
              <td className="py-2.5 px-2 text-right text-red-400 font-bold font-mono">
                {bowler.wickets}
              </td>
              <td className="py-2.5 pl-2 text-right text-orange-400 font-mono text-xs">
                {formatEconomy(bowler.runs, bowler.overs, bowler.balls)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ScorecardTable = ({ innings }) => {
  const [activeTab, setActiveTab] = useState("batting");

  if (!innings) return null;

  return (
    <div className="card">
      {/* Innings Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white">
            {innings.battingTeamName}
          </h3>
          <p className="text-sm text-gray-400 font-mono">
            {innings.totalRuns}/{innings.wickets} (
            {innings.oversCompleted}.{innings.ballsInCurrentOver} ov)
          </p>
        </div>
        <span className="text-xs text-gray-600">
          Innings {innings.inningsNumber}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800 rounded-lg p-1 mb-4">
        <button
          onClick={() => setActiveTab("batting")}
          className={`flex-1 py-1.5 rounded-md text-sm font-semibold transition-all ${
            activeTab === "batting"
              ? "bg-cricket-green text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Batting
        </button>
        <button
          onClick={() => setActiveTab("bowling")}
          className={`flex-1 py-1.5 rounded-md text-sm font-semibold transition-all ${
            activeTab === "bowling"
              ? "bg-cricket-green text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Bowling
        </button>
      </div>

      {/* Table */}
      {activeTab === "batting" ? (
        <BattingTable batters={innings.batters || []} />
      ) : (
        <BowlingTable bowlers={innings.bowlers || []} />
      )}

      {/* Extras */}
      {innings.extras && (
        <div className="mt-3 pt-3 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            Extras: {innings.extras.total || 0} (wd{" "}
            {innings.extras.wides || 0}, nb {innings.extras.noBalls || 0}, b{" "}
            {innings.extras.byes || 0}, lb {innings.extras.legByes || 0})
          </p>
        </div>
      )}
    </div>
  );
};

export default ScorecardTable;