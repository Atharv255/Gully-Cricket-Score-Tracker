import React from "react";
import clsx from "clsx";

const extras = [
  { value: "wide", label: "Wide", short: "WD", description: "+1 run, ball not counted" },
  { value: "no_ball", label: "No Ball", short: "NB", description: "+1 run, ball not counted" },
  { value: "bye", label: "Bye", short: "BYE", description: "Runs to team, not batsman" },
  { value: "leg_bye", label: "Leg Bye", short: "LB", description: "Runs to team, not batsman" },
];

const ExtrasButtons = ({ onExtra, disabled = false, selectedExtra }) => {
  return (
    <div>
      <p className="section-title">Extras</p>
      <div className="grid grid-cols-2 gap-2">
        {extras.map((extra) => (
          <button
            key={extra.value}
            type="button"
            disabled={disabled}
            onClick={() => onExtra(extra.value)}
            className={clsx(
              "extra-btn flex-col gap-0.5 py-2",
              selectedExtra === extra.value &&
                "border-amber-400 bg-amber-800/50",
              "disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            <span className="text-base font-black">{extra.short}</span>
            <span className="text-xs font-normal opacity-70">
              {extra.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExtrasButtons;