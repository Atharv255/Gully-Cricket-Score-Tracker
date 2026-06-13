import React from "react";
import { formatTimeAgo } from "../../utils/formatters";
import clsx from "clsx";

const getCommentaryStyle = (type) => {
  switch (type) {
    case "wicket":
      return "border-l-red-500 bg-red-950/20";
    case "six":
      return "border-l-purple-500 bg-purple-950/20";
    case "boundary":
      return "border-l-blue-500 bg-blue-950/20";
    case "over_complete":
      return "border-l-amber-500 bg-amber-950/20";
    case "innings_end":
    case "match_end":
      return "border-l-cricket-green bg-cricket-green/10";
    default:
      return "border-l-gray-700 bg-gray-800/30";
  }
};

const getCommentaryIcon = (type) => {
  switch (type) {
    case "wicket": return "🏏";
    case "six": return "🚀";
    case "boundary": return "🏃";
    case "over_complete": return "✅";
    case "innings_end": return "🏁";
    case "match_end": return "🏆";
    default: return "•";
  }
};

const CommentaryFeed = ({ commentary = [] }) => {
  if (!commentary || commentary.length === 0) {
    return (
      <div className="card">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Commentary
        </h3>
        <p className="text-gray-600 text-sm text-center py-4">
          Commentary will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
        Live Commentary
      </h3>
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {commentary.map((item, index) => (
          <div
            key={item._id || index}
            className={clsx(
              "border-l-2 pl-3 py-2 rounded-r-lg text-sm animate-slide-in",
              getCommentaryStyle(item.type)
            )}
          >
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0 text-base">
                {getCommentaryIcon(item.type)}
              </span>
              <div className="flex-1 min-w-0">
                {item.overNumber && item.ballNumber && (
                  <span className="text-xs font-mono font-bold text-gray-500 mr-2">
                    {item.overNumber}.{item.ballNumber}
                  </span>
                )}
                <span className="text-gray-200">{item.text}</span>
                <p className="text-xs text-gray-600 mt-0.5">
                  {formatTimeAgo(item.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentaryFeed;