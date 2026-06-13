import React from "react";
import { Link } from "react-router-dom";
import { MdArrowForward, MdLocationOn } from "react-icons/md";
import Badge from "../common/Badge";

const LiveMatchCard = ({ match }) => {
  if (!match) return null;

  const currentInnings = match.innings?.[match.innings.length - 1];

  return (
    <Link
      to={`/live/${match._id}`}
      className="block card hover:border-cricket-green/50 transition-all duration-200 hover:shadow-cricket-green/10 hover:shadow-lg group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white truncate group-hover:text-cricket-green transition-colors">
            {match.title}
          </h3>
          {match.groundName && (
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <MdLocationOn size={11} />
              {match.groundName}
            </p>
          )}
        </div>
        <Badge variant="live" pulse>
          LIVE
        </Badge>
      </div>

      {/* Score */}
      <div className="bg-gray-800/50 rounded-xl p-3 mb-3">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <p className="text-xs text-gray-500 mb-1">{match.teamA?.name}</p>
            {currentInnings?.battingTeamName === match.teamA?.name && (
              <p className="text-xl font-black text-white font-mono">
                {currentInnings.totalRuns}/{currentInnings.wickets}
                <span className="text-xs text-gray-500 ml-1 font-normal">
                  ({currentInnings.oversCompleted}.{currentInnings.ballsInCurrentOver} ov)
                </span>
              </p>
            )}
          </div>
          <div className="px-3">
            <p className="text-xs text-gray-600 font-bold">VS</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-xs text-gray-500 mb-1">{match.teamB?.name}</p>
            {currentInnings?.battingTeamName === match.teamB?.name && (
              <p className="text-xl font-black text-white font-mono">
                {currentInnings.totalRuns}/{currentInnings.wickets}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-600">{match.totalOvers} overs match</p>
        <div className="flex items-center gap-1 text-cricket-green text-xs font-medium group-hover:gap-2 transition-all">
          Watch Live <MdArrowForward size={14} />
        </div>
      </div>
    </Link>
  );
};

export default LiveMatchCard;