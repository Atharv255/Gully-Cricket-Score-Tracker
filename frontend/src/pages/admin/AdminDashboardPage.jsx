import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MdAdd,
  MdSportsCricket,
  MdLiveTv,
  MdHistory,
  MdGroup,
  MdRefresh,
  MdPlayArrow,
} from "react-icons/md";
import {
  useGetAllMatchesQuery,
  useStartMatchMutation,
  useDeleteMatchMutation,
  useGetMatchByIdQuery,
} from "../../features/match/matchApi";
import AdminMatchCard from "../../components/admin/AdminMatchCard";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import Select from "../../components/common/Select";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";

const StartMatchModal = ({ isOpen, onClose, matchId, onStart }) => {
  const [openingBatsmen, setOpeningBatsmen] = useState({
    striker: "",
    nonStriker: "",
  });
  const [openingBowler, setOpeningBowler] = useState({
    playerId: "",
    playerName: "",
  });

  const { data: matchData, isLoading: matchLoading } = useGetMatchByIdQuery(
    matchId,
    { skip: !matchId || !isOpen }
  );

  const [startMatch, { isLoading }] = useStartMatchMutation();

  const match = matchData?.data?.match;

  if (!isOpen) return null;

  if (matchLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Loading..." size="md">
        <Loader text="Loading match data..." />
      </Modal>
    );
  }

  if (!match) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Error" size="md">
        <p className="text-red-400 text-center py-4">Match not found</p>
        <Button fullWidth onClick={onClose}>Close</Button>
      </Modal>
    );
  }

  // Get full team data with players
  const teamA = match.teamA?.team;
  const teamB = match.teamB?.team;

  const teamAPlayers = teamA?.players || [];
  const teamBPlayers = teamB?.players || [];

  // Determine which team bats first based on battingFirst ID
  const battingFirstId = match.battingFirst?._id || match.battingFirst;
  const teamAId = teamA?._id || teamA;

  const isTeamABattingFirst =
    battingFirstId?.toString() === teamAId?.toString();

  const battingTeam = isTeamABattingFirst ? teamA : teamB;
  const bowlingTeam = isTeamABattingFirst ? teamB : teamA;

  const battingTeamPlayers = isTeamABattingFirst ? teamAPlayers : teamBPlayers;
  const bowlingTeamPlayers = isTeamABattingFirst ? teamBPlayers : teamAPlayers;

  const playerOptions = (players) => {
    if (!players || players.length === 0) return [];
    return players
      .map((p) => {
        const player = p.player;
        if (!player) return null;
        return {
          value: player._id || player,
          label: player.name || "Unknown",
        };
      })
      .filter(Boolean);
  };

  const handleStart = async () => {
    if (
      !openingBatsmen.striker ||
      !openingBatsmen.nonStriker ||
      !openingBowler.playerId
    ) {
      toast.error("Please select all opening players");
      return;
    }
    if (openingBatsmen.striker === openingBatsmen.nonStriker) {
      toast.error("Striker and non-striker must be different players");
      return;
    }
    try {
      await startMatch({
        matchId,
        openingBatsmen,
        openingBowler,
      }).unwrap();
      toast.success("🏏 Match started successfully!");
      onStart?.();
      onClose();
      // Reset state
      setOpeningBatsmen({ striker: "", nonStriker: "" });
      setOpeningBowler({ playerId: "", playerName: "" });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to start match");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Start Match - Select Opening Players"
      size="md"
    >
      <div className="space-y-4">
        {/* Batting First Info */}
        <div className="bg-cricket-green/10 border border-cricket-green/30 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-400">Batting First</p>
          <p className="text-base font-bold text-cricket-green">
            {battingTeam?.name || "Unknown Team"}
          </p>
        </div>

        {/* Debug Info - Remove in production */}
        {battingTeamPlayers.length === 0 && (
          <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-3">
            <p className="text-red-400 text-xs">
              ⚠️ No players found for batting team. Please check the match data.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Team A players: {teamAPlayers.length} | Team B players: {teamBPlayers.length}
            </p>
          </div>
        )}

        {/* Opening Batsmen */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gray-300">
            🏏 Opening Batsmen
          </h4>

          <Select
            label="Striker (Opening Batsman)"
            value={openingBatsmen.striker}
            onChange={(e) =>
              setOpeningBatsmen((p) => ({ ...p, striker: e.target.value }))
            }
            options={playerOptions(battingTeamPlayers)}
            placeholder={
              battingTeamPlayers.length === 0
                ? "No players available"
                : "Select striker"
            }
            required
            disabled={battingTeamPlayers.length === 0}
          />

          <Select
            label="Non-Striker"
            value={openingBatsmen.nonStriker}
            onChange={(e) =>
              setOpeningBatsmen((p) => ({ ...p, nonStriker: e.target.value }))
            }
            options={playerOptions(battingTeamPlayers).filter(
              (p) => p.value !== openingBatsmen.striker
            )}
            placeholder={
              battingTeamPlayers.length === 0
                ? "No players available"
                : "Select non-striker"
            }
            required
            disabled={battingTeamPlayers.length === 0 || !openingBatsmen.striker}
          />
        </div>

        {/* Opening Bowler */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gray-300">⚾ Opening Bowler</h4>
          <p className="text-xs text-gray-500">
            From: {bowlingTeam?.name || "Bowling Team"}
          </p>

          <Select
            label="Select Bowler"
            value={openingBowler.playerId}
            onChange={(e) => {
              const player = bowlingTeamPlayers.find(
                (p) => (p.player?._id || p.player) === e.target.value
              );
              setOpeningBowler({
                playerId: e.target.value,
                playerName: player?.player?.name || "",
              });
            }}
            options={playerOptions(bowlingTeamPlayers)}
            placeholder={
              bowlingTeamPlayers.length === 0
                ? "No players available"
                : "Select opening bowler"
            }
            required
            disabled={bowlingTeamPlayers.length === 0}
          />
        </div>

        {/* Selected Summary */}
        {openingBatsmen.striker &&
          openingBatsmen.nonStriker &&
          openingBowler.playerId && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                Ready to Start
              </p>
              <p className="text-xs text-gray-300">
                🏏 Striker:{" "}
                <span className="text-white font-semibold">
                  {playerOptions(battingTeamPlayers).find(
                    (p) => p.value === openingBatsmen.striker
                  )?.label}
                </span>
              </p>
              <p className="text-xs text-gray-300">
                🏃 Non-Striker:{" "}
                <span className="text-white font-semibold">
                  {playerOptions(battingTeamPlayers).find(
                    (p) => p.value === openingBatsmen.nonStriker
                  )?.label}
                </span>
              </p>
              <p className="text-xs text-gray-300">
                ⚾ Bowler:{" "}
                <span className="text-white font-semibold">
                  {openingBowler.playerName}
                </span>
              </p>
            </div>
          )}

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button
            fullWidth
            loading={isLoading}
            onClick={handleStart}
            icon={MdPlayArrow}
            disabled={
              !openingBatsmen.striker ||
              !openingBatsmen.nonStriker ||
              !openingBowler.playerId
            }
          >
            Start Match
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const AdminDashboardPage = () => {
  const user = useSelector(selectUser);
  const [activeFilter, setActiveFilter] = useState("all");
  const [startModalData, setStartModalData] = useState({
    isOpen: false,
    matchId: null,
  });

  const { data, isLoading, refetch, isFetching } = useGetAllMatchesQuery(
    activeFilter !== "all" ? { status: activeFilter } : {}
  );

  const [deleteMatch] = useDeleteMatchMutation();

  const matches = data?.data || [];

  const stats = {
    total: matches.length,
    live: matches.filter((m) => m.status === "live").length,
    upcoming: matches.filter((m) => m.status === "upcoming").length,
    completed: matches.filter((m) => m.status === "completed").length,
  };

  const handleDelete = async (matchId) => {
    if (!window.confirm("Are you sure you want to delete this match?")) return;
    try {
      await deleteMatch(matchId).unwrap();
      toast.success("Match deleted successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete match");
    }
  };

  const handleStartClick = (matchId) => {
    setStartModalData({ isOpen: true, matchId });
  };

  const handleStartSuccess = () => {
    refetch();
  };

  const filters = [
    { value: "all", label: "All" },
    { value: "live", label: "Live" },
    { value: "upcoming", label: "Upcoming" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">
            Welcome, {user?.username || "Admin"} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your cricket matches from here
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={refetch}
            icon={MdRefresh}
            disabled={isFetching}
          >
            Refresh
          </Button>
          <Link to="/admin/create-match">
            <Button size="sm" icon={MdAdd}>
              Create Match
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Matches",
            value: stats.total,
            icon: MdSportsCricket,
            color: "text-cricket-green",
            bg: "bg-cricket-green/10",
          },
          {
            label: "Live Now",
            value: stats.live,
            icon: MdLiveTv,
            color: "text-red-400",
            bg: "bg-red-950/30",
          },
          {
            label: "Upcoming",
            value: stats.upcoming,
            icon: MdPlayArrow,
            color: "text-blue-400",
            bg: "bg-blue-950/30",
          },
          {
            label: "Completed",
            value: stats.completed,
            icon: MdHistory,
            color: "text-green-400",
            bg: "bg-green-950/30",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} border border-gray-800 rounded-xl p-4`}
          >
            <div className="flex items-center gap-3">
              <stat.icon className={`${stat.color} text-2xl`} />
              <div>
                <p className={`text-2xl font-black ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            to: "/admin/create-match",
            icon: MdAdd,
            label: "Create Match",
            color:
              "bg-cricket-green/10 border-cricket-green/30 hover:bg-cricket-green/20",
            textColor: "text-cricket-green",
          },
          {
            to: "/admin/teams",
            icon: MdGroup,
            label: "Manage Teams",
            color: "bg-blue-950/30 border-blue-900/30 hover:bg-blue-950/50",
            textColor: "text-blue-400",
          },
          {
            to: "/admin/history",
            icon: MdHistory,
            label: "Match History",
            color: "bg-amber-950/30 border-amber-900/30 hover:bg-amber-950/50",
            textColor: "text-amber-400",
          },
          {
            to: "/",
            icon: MdLiveTv,
            label: "View Live",
            color: "bg-red-950/30 border-red-900/30 hover:bg-red-950/50",
            textColor: "text-red-400",
          },
        ].map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${action.color}`}
          >
            <action.icon className={`text-2xl ${action.textColor}`} />
            <span className={`text-xs font-semibold ${action.textColor}`}>
              {action.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Matches */}
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-lg font-bold text-white">Matches</h2>
          <div className="flex items-center gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeFilter === f.value
                    ? "bg-cricket-green text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <Loader text="Loading matches..." />
        ) : matches.length === 0 ? (
          <div className="text-center py-16 card">
            <MdSportsCricket className="text-gray-700 text-6xl mx-auto mb-4" />
            <p className="text-gray-500 text-base font-semibold">
              No matches found
            </p>
            <p className="text-gray-600 text-sm mt-1 mb-6">
              Create your first match to get started
            </p>
            <Link to="/admin/create-match">
              <Button icon={MdAdd}>Create Match</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((match) => (
              <AdminMatchCard
                key={match._id}
                match={match}
                onDelete={handleDelete}
                onStart={handleStartClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Start Match Modal */}
      <StartMatchModal
        isOpen={startModalData.isOpen}
        onClose={() => setStartModalData({ isOpen: false, matchId: null })}
        matchId={startModalData.matchId}
        onStart={handleStartSuccess}
      />
    </div>
  );
};

export default AdminDashboardPage;