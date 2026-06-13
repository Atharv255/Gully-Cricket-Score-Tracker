import React from "react";
import { Link } from "react-router-dom";
import { MdCalendarToday, MdLocationOn, MdAccessTime } from "react-icons/md";
import Badge from "../common/Badge";
import { formatDate } from "../../utils/formatters";

const UpcomingMatchCard = ({ match }) => {
  if (!match) return null;

  return (
    <div className="card hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-sm font-bold text-white flex-1 min-w-0 truncate">
          {match.title}
        </h3>
        <Badge variant="upcoming">UPCOMING</Badge>
      </div>

      <div className="flex items-center justify-between bg-gray-800/50 rounded-xl p-3 mb-3">
        <p className="text-sm font-bold text-white text-center flex-1">
          {match.teamA?.name}
        </p>
        <div className="text-center px-3">
          <p className="text-xs text-gray-600">VS</p>
          <p className="text-xs text-gray-600">{match.totalOvers}ov</p>
        </div>
        <p className="text-sm font-bold text-white text-center flex-1">
          {match.teamB?.name}
        </p>
      </div>

      <div className="flex items-center gap-4">
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
  );
};

export default UpcomingMatchCard;