import React from "react";
import { Link } from "react-router-dom";
import { MdArrowForward } from "react-icons/md";
import Badge from "../common/Badge";
import { formatDate } from "../../utils/formatters";

const CompletedMatchCard = ({ match }) => {
  if (!match) return null;

  const innings1 = match.innings?.find((i) => i.inningsNumber === 1);
  const innings2 = match.innings?.find((i) => i.inningsNumber === 2);

  return (
    <Link
      to={`/scorecard/${match._id}`}
      className="block card hover:border-gray-700 transition-colors group"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-sm font-bold text-white flex-1 min-w-0 truncate group-hover:text-gray-300">
          {match.title}
        </h3>
        <Badge variant="completed">DONE</Badge>
      </div>

      <div className="flex items-center justify-between bg-gray-800/50 rounded-xl p-3 mb-3">
        <div className="flex-1 text-center">
          <p className="text-xs text-gray-500 mb-1">{innings1?.battingTeam || match.teamA?.name}</p>
          {innings1 && (
            <p className="text-sm font-bold text-white font-mono">
              {innings1.totalRuns}/{innings1.wickets}
            </p>
          )}
          {innings1 && (
            <p className="text-xs text-gray-600">
              ({innings1.oversCompleted}.{innings1.ballsInCurrentOver || 0} ov)
            </p>
          )}
        </div>
        <div className="px-2">
          <p className="text-xs text-gray-600">VS</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-xs text-gray-500 mb-1">{innings2?.battingTeam || match.teamB?.name}</p>
          {innings2 && (
            <p className="text-sm font-bold text-white font-mono">
              {innings2.totalRuns}/{innings2.wickets}
            </p>
          )}
          {innings2 && (
            <p className="text-xs text-gray-600">
              ({innings2.oversCompleted}.{innings2.ballsInCurrentOver || 0} ov)
            </p>
          )}
        </div>
      </div>

      {match.result?.description && (
        <p className="text-xs text-cricket-green font-semibold text-center bg-cricket-green/10 rounded-lg px-2 py-1 mb-2">
          {match.result.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-600">{formatDate(match.matchDate)}</p>
        <span className="text-xs text-gray-500 flex items-center gap-1 group-hover:text-gray-300">
          Scorecard <MdArrowForward size={12} />
        </span>
      </div>
    </Link>
  );
};

export default CompletedMatchCard;