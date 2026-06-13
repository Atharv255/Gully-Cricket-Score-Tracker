import React from "react";
import clsx from "clsx";

const getBallClass = (ball) => {
  if (ball.isWicket || ball.display === "W") {
    return "ball-wicket";
  }
  if (ball.display === "4" || ball.runs === 4) {
    return "ball-four";
  }
  if (ball.display === "6" || ball.runs === 6) {
    return "ball-six";
  }
  if (
    ball.display === "0" ||
    ball.display === "•" ||
    (ball.runs === 0 && !ball.isExtra)
  ) {
    return "ball-dot-zero";
  }
  if (ball.isExtra) {
    return "ball-extra";
  }
  return "ball-normal";
};

const RecentBalls = ({ recentBalls = [] }) => {
  if (!recentBalls || recentBalls.length === 0) {
    return (
      <div className="card mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Recent Balls
        </h3>
        <p className="text-gray-600 text-sm text-center py-2">
          No balls bowled yet
        </p>
      </div>
    );
  }

  const last12 = recentBalls.slice(-12);

  // Group last 6 for current over
  const currentOverBalls = last12.slice(-6);
  const previousBalls = last12.slice(0, -6);

  return (
    <div className="card mb-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
        Recent Balls
      </h3>

      {/* Current Over */}
      <div className="mb-2">
        <p className="text-xs text-gray-600 mb-2">This Over</p>
        <div className="flex items-center gap-2 flex-wrap">
          {currentOverBalls.map((ball, index) => (
            <div
              key={index}
              className={clsx("ball-dot text-xs animate-fade-in", getBallClass(ball))}
              title={`Over ${ball.overNumber}.${ball.ballNumber}: ${ball.display}`}
            >
              {ball.display === "0" ? "•" : ball.display}
            </div>
          ))}
          {currentOverBalls.length === 0 && (
            <span className="text-gray-600 text-xs">Over just started</span>
          )}
        </div>
      </div>

      {/* Previous balls */}
      {previousBalls.length > 0 && (
        <div>
          <p className="text-xs text-gray-600 mb-2">Previous</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            {previousBalls.map((ball, index) => (
              <div
                key={index}
                className={clsx(
                  "w-7 h-7 text-xs rounded-full flex items-center justify-center font-bold opacity-60",
                  getBallClass(ball)
                )}
              >
                {ball.display === "0" ? "•" : ball.display}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentBalls;