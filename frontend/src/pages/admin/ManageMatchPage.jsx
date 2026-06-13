import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdSportsCricket,
  MdShare,
  MdDelete,
  MdEdit,
} from "react-icons/md";
import { useGetMatchByIdQuery, useDeleteMatchMutation } from "../../features/match/matchApi";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import Card from "../../components/common/Card";
import ScorecardTable from "../../components/viewer/ScorecardTable";
import { formatDate } from "../../utils/formatters";
import toast from "react-hot-toast";

const ManageMatchPage = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetMatchByIdQuery(matchId);
  const [deleteMatch, { isLoading: isDeleting }] = useDeleteMatchMutation();

  const match = data?.data?.match;

  const handleShare = () => {
    if (match?.shareToken) {
      const url = `${window.location.origin}/live/${match._id}`;
      navigator.clipboard.writeText(url).then(() => {
        toast.success("Match link copied to clipboard!");
      });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this match? This cannot be undone.")) return;
    try {
      await deleteMatch(matchId).unwrap();
      toast.success("Match deleted");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error("Failed to delete match");
    }
  };

  if (isLoading) return <Loader text="Loading match..." />;
  if (isError || !match) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Match not found</p>
        <Link to="/admin/dashboard" className="text-cricket-green text-sm mt-2 block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/dashboard"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <MdArrowBack size={22} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white">{match.title}</h1>
            <p className="text-gray-500 text-sm">
              {formatDate(match.matchDate)} · {match.groundName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={match.status} pulse={match.status === "live"}>
            {match.status?.toUpperCase()}
          </Badge>
          {match.status === "live" && (
            <Link to={`/admin/match/${matchId}/scoring`}>
              <Button size="sm" icon={MdSportsCricket}>
                Go to Scoring
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Match Info */}
      <Card title="Match Information">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-box">
            <p className="stat-label">Total Overs</p>
            <p className="stat-value text-lg">{match.totalOvers}</p>
          </div>
          <div className="stat-box">
            <p className="stat-label">Status</p>
            <p className="stat-value text-lg capitalize">{match.status}</p>
          </div>
          <div className="stat-box">
            <p className="stat-label">Toss Winner</p>
            <p className="text-sm font-bold text-white">{match.toss?.winner}</p>
          </div>
          <div className="stat-box">
            <p className="stat-label">Elected To</p>
            <p className="text-sm font-bold text-cricket-green capitalize">
              {match.toss?.decision}
            </p>
          </div>
        </div>
      </Card>

      {/* Teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { team: match.teamA?.team, label: "Team A" },
          { team: match.teamB?.team, label: "Team B" },
        ].map(({ team, label }) => (
          <Card key={label} title={label}>
            {team ? (
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Team Name</p>
                  <p className="text-base font-bold text-white">{team.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Captain</p>
                  <p className="text-sm text-gray-300">{team.captain}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Players ({team.players?.length || 0})
                  </p>
                  <div className="space-y-1">
                    {team.players?.map((p, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-400"
                      >
                        <span className="text-gray-600 text-xs w-4">
                          {index + 1}.
                        </span>
                        <span>{p.player?.name || "Unknown"}</span>
                        {p.isCaptain && (
                          <span className="text-amber-400 text-xs">(C)</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No team data</p>
            )}
          </Card>
        ))}
      </div>

      {/* Result */}
      {match.status === "completed" && match.result && (
        <Card title="Match Result">
          <div className="text-center py-4">
            <p className="text-2xl mb-2">🏆</p>
            <p className="text-lg font-black text-cricket-green">
              {match.result.description}
            </p>
            {match.result.manOfTheMatch?.playerName && (
              <p className="text-sm text-gray-400 mt-2">
                ⭐ MOM: {match.result.manOfTheMatch.playerName}
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Scorecards */}
      {match.innings?.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Scorecards</h2>
          {match.innings.map((innings) => (
            <ScorecardTable key={innings._id} innings={innings} />
          ))}
        </div>
      )}

      {/* Actions */}
      <Card>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={handleShare}
            icon={MdShare}
            size="sm"
          >
            Share Link
          </Button>
          <Link to={`/live/${matchId}`} target="_blank">
            <Button variant="secondary" size="sm">
              View Live Page
            </Button>
          </Link>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={isDeleting}
            icon={MdDelete}
            size="sm"
          >
            Delete Match
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ManageMatchPage;