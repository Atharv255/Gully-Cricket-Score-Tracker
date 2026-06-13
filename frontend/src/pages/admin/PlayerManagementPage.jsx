import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MdArrowBack,
  MdPerson,
  MdSearch,
  MdDelete,
  MdAdd,
  MdRefresh,
  MdSportsCricket,
  MdFilterList,
} from "react-icons/md";
import {
  useGetAllPlayersQuery,
  useDeletePlayerMutation,
} from "../../features/player/playerApi";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import PlayerForm from "../../components/admin/PlayerForm";
import Badge from "../../components/common/Badge";
import toast from "react-hot-toast";

const roleColors = {
  batsman: "text-blue-400 bg-blue-950/50",
  bowler: "text-red-400 bg-red-950/50",
  all_rounder: "text-green-400 bg-green-950/50",
  wicket_keeper: "text-amber-400 bg-amber-950/50",
  unknown: "text-gray-400 bg-gray-800",
};

const roleLabels = {
  batsman: "BAT",
  bowler: "BOWL",
  all_rounder: "AR",
  wicket_keeper: "WK",
  unknown: "?",
};

const PlayerRow = ({ player, index, onDelete }) => (
  <tr className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors group">
    <td className="py-3 px-4 text-gray-600 text-xs w-10">{index + 1}</td>
    <td className="py-3 px-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 border border-gray-700">
          <span className="text-xs font-bold text-gray-400">
            {player.jerseyNumber || player.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="font-semibold text-white text-sm">{player.name}</p>
          {player.battingStyle && (
            <p className="text-xs text-gray-600 capitalize">
              {player.battingStyle.replace("_", " ")} bat
            </p>
          )}
        </div>
      </div>
    </td>
    <td className="py-3 px-4">
      <span
        className={`text-xs font-bold px-2 py-1 rounded-full ${
          roleColors[player.role] || roleColors.unknown
        }`}
      >
        {roleLabels[player.role] || "?"}
      </span>
    </td>
    <td className="py-3 px-4 text-gray-400 text-xs capitalize hidden md:table-cell">
      {player.role?.replace("_", " ") || "Unknown"}
    </td>
    <td className="py-3 px-4 text-gray-500 text-xs hidden lg:table-cell">
      {player.bowlingStyle || "—"}
    </td>
    <td className="py-3 px-4 text-right">
      <Button
        size="xs"
        variant="danger"
        onClick={() => onDelete(player._id)}
        icon={MdDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        Delete
      </Button>
    </td>
  </tr>
);

const PlayerManagementPage = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const {
    data,
    isLoading,
    refetch,
    isFetching,
  } = useGetAllPlayersQuery({ search });

  const [deletePlayer] = useDeletePlayerMutation();

  const players = data?.data || [];

  const filtered = players.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.bowlingStyle?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || p.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDelete = async (playerId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this player? This action cannot be undone."
      )
    )
      return;
    try {
      await deletePlayer(playerId).unwrap();
      toast.success("Player deleted successfully");
    } catch {
      toast.error("Failed to delete player");
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    refetch();
  };

  const roleFilters = [
    { value: "all", label: "All" },
    { value: "batsman", label: "Batsmen" },
    { value: "bowler", label: "Bowlers" },
    { value: "all_rounder", label: "All Rounders" },
    { value: "wicket_keeper", label: "WK" },
    { value: "unknown", label: "Unknown" },
  ];

  // Stats
  const stats = {
    total: players.length,
    batsmen: players.filter((p) => p.role === "batsman").length,
    bowlers: players.filter((p) => p.role === "bowler").length,
    allRounders: players.filter((p) => p.role === "all_rounder").length,
    wicketKeepers: players.filter((p) => p.role === "wicket_keeper").length,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/dashboard"
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <MdArrowBack size={22} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              <MdPerson className="text-cricket-green" />
              Player Management
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {players.length} player{players.length !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={refetch}
            icon={MdRefresh}
            disabled={isFetching}
          >
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
          <Button
            size="sm"
            icon={MdAdd}
            onClick={() => setShowCreateModal(true)}
          >
            Add Player
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          {
            label: "Total",
            value: stats.total,
            color: "text-white",
          },
          {
            label: "Batsmen",
            value: stats.batsmen,
            color: "text-blue-400",
          },
          {
            label: "Bowlers",
            value: stats.bowlers,
            color: "text-red-400",
          },
          {
            label: "All Rounders",
            value: stats.allRounders,
            color: "text-green-400",
          },
          {
            label: "WK",
            value: stats.wicketKeepers,
            color: "text-amber-400",
          },
        ].map((stat) => (
          <div key={stat.label} className="stat-box text-center">
            <p className={`stat-value text-xl ${stat.color}`}>
              {stat.value}
            </p>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        <Input
          placeholder="Search players by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={MdSearch}
        />

        {/* Role Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <MdFilterList className="text-gray-500" size={16} />
          {roleFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setRoleFilter(filter.value)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                roleFilter === filter.value
                  ? "bg-cricket-green text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Players Table */}
      {isLoading ? (
        <Loader text="Loading players..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 card">
          <MdPerson className="text-gray-700 text-6xl mx-auto mb-4" />
          <p className="text-gray-500 text-base font-semibold">
            {search || roleFilter !== "all"
              ? "No players match your filters"
              : "No players added yet"}
          </p>
          <p className="text-gray-600 text-sm mt-1 mb-6">
            {search || roleFilter !== "all"
              ? "Try clearing your search or filter"
              : "Players are created automatically when you create a match"}
          </p>
          {!search && roleFilter === "all" && (
            <Button
              icon={MdAdd}
              onClick={() => setShowCreateModal(true)}
            >
              Add First Player
            </Button>
          )}
          {(search || roleFilter !== "all") && (
            <Button
              variant="secondary"
              onClick={() => {
                setSearch("");
                setRoleFilter("all");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          {/* Table Header */}
          <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Showing {filtered.length} of {players.length} players
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/50">
                  <th className="text-left text-xs text-gray-600 font-semibold py-3 px-4 w-10">
                    #
                  </th>
                  <th className="text-left text-xs text-gray-600 font-semibold py-3 px-4">
                    Player
                  </th>
                  <th className="text-left text-xs text-gray-600 font-semibold py-3 px-4">
                    Role
                  </th>
                  <th className="text-left text-xs text-gray-600 font-semibold py-3 px-4 hidden md:table-cell">
                    Full Role
                  </th>
                  <th className="text-left text-xs text-gray-600 font-semibold py-3 px-4 hidden lg:table-cell">
                    Bowling Style
                  </th>
                  <th className="text-right text-xs text-gray-600 font-semibold py-3 px-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((player, index) => (
                  <PlayerRow
                    key={player._id}
                    player={player}
                    index={index}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-4 py-3 border-t border-gray-800 bg-gray-900/30">
            <p className="text-xs text-gray-600 text-center">
              {filtered.length} player{filtered.length !== 1 ? "s" : ""} shown
              · Hover over row to see delete option
            </p>
          </div>
        </div>
      )}

      {/* Add Player Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Player"
        size="md"
      >
        <PlayerForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
};

export default PlayerManagementPage;