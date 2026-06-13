import React from "react";
import clsx from "clsx";

const wickets = [
  { value: "bowled", label: "Bowled", icon: "🎯" },
  { value: "caught", label: "Caught", icon: "🤲" },
  { value: "run_out", label: "Run Out", icon: "🏃" },
  { value: "lbw", label: "LBW", icon: "🦵" },
  { value: "stumped", label: "Stumped", icon: "🏏" },
  { value: "hit_wicket", label: "Hit Wicket", icon: "💥" },
];

const WicketButtons = ({ onWicket, disabled = false, selectedWicket }) => {
  return (
    <div>
      <p className="section-title">Wickets</p>
      <div className="grid grid-cols-3 gap-2">
        {wickets.map((wicket) => (
          <button
            key={wicket.value}
            type="button"
            disabled={disabled}
            onClick={() => onWicket(wicket.value)}
            className={clsx(
              "wicket-btn flex-col gap-1 py-2.5",
              selectedWicket === wicket.value &&
                "border-red-400 bg-red-800/50",
              "disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            <span className="text-lg">{wicket.icon}</span>
            <span className="text-xs font-bold">{wicket.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WicketButtons;