import React from "react";
import clsx from "clsx";

const RunButtons = ({ onRun, disabled = false, selectedExtra }) => {
  const runs = [0, 1, 2, 3, 4, 5, 6];

  const getButtonClass = (run) => {
    if (run === 4) return "run-btn-four";
    if (run === 6) return "run-btn-six";
    return "run-btn";
  };

  const getLabel = (run) => {
    if (run === 0) return "•";
    return run.toString();
  };

  return (
    <div>
      <p className="section-title">Runs</p>
      <div className="grid grid-cols-7 gap-2">
        {runs.map((run) => (
          <button
            key={run}
            type="button"
            disabled={disabled}
            onClick={() => onRun(run)}
            className={clsx(
              getButtonClass(run),
              "disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            <span className="text-2xl font-black">{getLabel(run)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RunButtons;