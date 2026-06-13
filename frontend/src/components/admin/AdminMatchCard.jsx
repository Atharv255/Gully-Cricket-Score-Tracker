import React from "react";
import { Link } from "react-router-dom";
import {
  MdSportsCricket,
  MdLocationOn,
  MdCalendarToday,
  MdEdit,
  MdDelete,
  MdPlayArrow,
  MdVisibility,
} from "react-icons/md";
import Badge from "../common/Badge";
import Button from "../common/Button";
import { formatDate, formatScore } from "../../utils/formatters";

const AdminMatchCard = ({ match, onDelete, onStart }) => {
  if (!match) return null;

  const currentInnings = match.innings?.[match.innings.length - 1];

  return (
    <div className="card hover:border-gray-700 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-white truncate">
            {match.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {match.groundName && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MdLocationOn size={12} />
                {match.groundName}
              </span>
            )}
            {match.matchDate && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MdCalendarToday size={12} />
                {formatDate(match.matchDate)}
              </span>
            )}
          </div>
        </div>
        <Badge variant={match.status} pulse={match.status === "live"}>
          {match.status?.toUpperCase()}
        </Badge>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-3 mb-3">
        <div className="text-center">
          <p className="text-sm font-bold text-white">{match.teamA?.name}</p>
          {currentInnings &&
            currentInnings.inningsNumber === 1 &&
            currentInnings.battingTeamName === match.teamA?.name && (
              <p className="text-sm font-mono font-bold text-cricket-green mt-1">
                {formatScore(
                  currentInnings.totalRuns,
                  currentInnings.wickets
                )}
                <span className="text-xs text-gray-500 ml-1 font-normal">
                  ({currentInnings.oversCompleted}.{currentInnings.ballsInCurrentOver})
                </span>
              </p>
            )}
        </div>
        <div className="text-center px-4">
          <p className="text-xs text-gray-600 font-bold">VS</p>
          <p className="text-xs text-gray-500 mt-0.5">{match.totalOvers}ov</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-white">{match.teamB?.name}</p>
          {currentInnings &&
            currentInnings.inningsNumber === 1 &&
            currentInnings.battingTeamName === match.teamB?.name && (
              <p className="text-sm font-mono font-bold text-cricket-green mt-1">
                {formatScore(
                  currentInnings.totalRuns,
                  currentInnings.wickets
                )}
              </p>
            )}
        </div>
      </div>

      {/* Result */}
      {match.status === "completed" && match.result?.description && (
        <div className="bg-cricket-green/10 border border-cricket-green/20 rounded-lg px-3 py-1.5 mb-3">
          <p className="text-xs text-cricket-green font-medium text-center">
            {match.result.description}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {match.status === "upcoming" && (
          <Button
            size="sm"
            variant="success"
            onClick={() => onStart?.(match._id)}
            icon={MdPlayArrow}
          >
            Start
          </Button>
        )}

        {match.status === "live" && (
          <Link to={`/admin/match/${match._id}/scoring`}>
            <Button size="sm" variant="primary" icon={MdSportsCricket}>
              Score
            </Button>
          </Link>
        )}

        <Link to={`/live/${match._id}`} target="_blank">
          <Button size="sm" variant="outline" icon={MdVisibility}>
            View
          </Button>
        </Link>

        <Link to={`/admin/match/${match._id}/manage`}>
          <Button size="sm" variant="secondary" icon={MdEdit}>
            Manage
          </Button>
        </Link>

        <Button
          size="sm"
          variant="danger"
          onClick={() => onDelete?.(match._id)}
          icon={MdDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default AdminMatchCard;