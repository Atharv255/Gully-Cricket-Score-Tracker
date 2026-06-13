import React, { useState } from "react";

const TossForm = ({
  teamAName = "Team A",
  teamBName = "Team B",
  value = { winner: "", decision: "" },
  onChange,
  errors = {},
}) => {
  const handleWinnerSelect = (winner) => {
    onChange?.({ ...value, winner });
  };

  const handleDecisionSelect = (decision) => {
    onChange?.({ ...value, decision });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">🪙</span>
        <h3 className="text-base font-bold text-white">Toss Details</h3>
      </div>

      {/* Toss Winner */}
      <div>
        <label className="label">
          Toss Winner <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[teamAName, teamBName].map((team) => (
            <button
              key={team}
              type="button"
              onClick={() => handleWinnerSelect(team)}
              className={`py-4 px-4 rounded-xl border-2 font-bold text-sm transition-all ${
                value.winner === team
                  ? "border-cricket-green bg-cricket-green/20 text-cricket-green"
                  : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">🏏</span>
                <span>{team}</span>
              </div>
            </button>
          ))}
        </div>
        {errors.tossWinner && (
          <p className="text-red-400 text-xs mt-1">⚠ {errors.tossWinner}</p>
        )}
      </div>

      {/* Elected To */}
      {value.winner && (
        <div className="animate-fade-in">
          <label className="label">
            <span className="text-cricket-green font-semibold">
              {value.winner}
            </span>{" "}
            elected to <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[
              {
                value: "bat",
                label: "Bat First",
                icon: "🏏",
                desc: "Open the innings",
              },
              {
                value: "bowl",
                label: "Bowl First",
                icon: "⚾",
                desc: "Chase the target",
              },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleDecisionSelect(option.value)}
                className={`py-4 px-4 rounded-xl border-2 font-bold text-sm transition-all ${
                  value.decision === option.value
                    ? "border-cricket-green bg-cricket-green/20 text-cricket-green"
                    : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">{option.icon}</span>
                  <span>{option.label}</span>
                  <span className="text-xs font-normal opacity-70">
                    {option.desc}
                  </span>
                </div>
              </button>
            ))}
          </div>
          {errors.tossDecision && (
            <p className="text-red-400 text-xs mt-1">
              ⚠ {errors.tossDecision}
            </p>
          )}
        </div>
      )}

      {/* Summary */}
      {value.winner && value.decision && (
        <div className="bg-cricket-green/10 border border-cricket-green/30 rounded-xl p-4 animate-fade-in">
          <p className="text-sm text-center text-gray-300">
            🪙{" "}
            <span className="font-bold text-cricket-green">
              {value.winner}
            </span>{" "}
            won the toss and elected to{" "}
            <span className="font-bold text-cricket-green capitalize">
              {value.decision}
            </span>{" "}
            first
          </p>
          <p className="text-xs text-center text-gray-500 mt-1">
            {value.decision === "bat"
              ? `${value.winner} will open the innings`
              : `${
                  value.winner === teamAName ? teamBName : teamAName
                } will open the innings`}
          </p>
        </div>
      )}
    </div>
  );
};

export default TossForm;