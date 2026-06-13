import React from "react";
import { MdLocationOn, MdCalendarToday, MdWifi, MdWifiOff } from "react-icons/md";
import Badge from "../common/Badge";
import { formatDate } from "../../utils/formatters";
import { useSelector } from "react-redux";
import { selectSocketConnected } from "../../features/socket/socketSlice";

const ScoreHeader = ({ match, liveScore }) => {
  const isConnected = useSelector(selectSocketConnected);

  if (!match) return null;

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-4 mb-4">
      {/* Top Row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white leading-tight">
            {match.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-1.5">
            {match.groundName && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <MdLocationOn size={13} className="text-gray-500" />
                {match.groundName}
              </span>
            )}
            {match.matchDate && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <MdCalendarToday size={13} className="text-gray-500" />
                {formatDate(match.matchDate)}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge
            variant={match.status}
            pulse={match.status === "live"}
          >
            {match.status?.toUpperCase()}
          </Badge>
          <div className="flex items-center gap-1.5">
            {isConnected ? (
              <MdWifi size={14} className="text-green-500" />
            ) : (
              <MdWifiOff size={14} className="text-red-500" />
            )}
            <span className={`text-xs ${isConnected ? "text-green-500" : "text-red-500"}`}>
              {isConnected ? "Live" : "Reconnecting..."}
            </span>
          </div>
        </div>
      </div>

      {/* Toss Info */}
      {match.toss && (
        <div className="bg-gray-800/50 rounded-lg px-3 py-2">
          <p className="text-xs text-gray-400">
            🪙 <span className="text-gray-300 font-medium">{match.toss.winner}</span>
            {" "}won the toss and elected to{" "}
            <span className="text-cricket-green font-medium">
              {match.toss.decision}
            </span>
            {" "}first
          </p>
        </div>
      )}

      {/* Match Result */}
      {match.status === "completed" && match.result && (
        <div className="mt-3 bg-cricket-green/20 border border-cricket-green/30 rounded-lg px-3 py-2">
          <p className="text-sm font-bold text-cricket-green text-center">
            🏆 {match.result.description}
          </p>
          {match.result.manOfTheMatch?.playerName && (
            <p className="text-xs text-gray-300 text-center mt-1">
              ⭐ Man of the Match: {match.result.manOfTheMatch.playerName}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ScoreHeader;