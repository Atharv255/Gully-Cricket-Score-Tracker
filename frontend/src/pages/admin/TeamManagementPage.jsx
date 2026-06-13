import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MdArrowBack,
  MdAdd,
  MdGroup,
  MdDelete,
  MdSearch,
  MdPeople,
  MdSportsCricket,
  MdRefresh,
} from "react-icons/md";
import {
  useGetAllTeamsQuery,
  useDeleteTeamMutation,
} from "../../features/team/teamApi";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import TeamForm from "../../components/admin/TeamForm";
import toast from "react-hot-toast";

const TeamCard = ({ team, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card hover:border-gray-700 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cricket-green/20 border border-cricket-green/30 flex items-center justify-center flex-shrink-0">
            <span className="text-cricket-green font-black text-sm">
              {team.shortName || team.name?.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{team.name}</h3>
            <p className="text-xs text-gray-500">
              Captain:{" "}
              <span className="text-gray-300">{team.captain}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-full font-semibold">
            {team.players?.length || 0}/11
          </span>
        </div>
      </div>

      {/* Players Preview */}
      <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Squad
          </p>
          {team.players?.length > 5 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-cricket-green hover:underline"
            >
              {expanded ? "Show less" : `+${team.players.length - 5} more`}
            </button>
          )}
        </div>
        <div className="space-y-1">
          {team.players
            ?.slice(0, expanded ? team.players.length : 5)
            .map((p, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm"
              >
                <span className="text-gray-700 text-xs w-4 text-right">
                  {index + 1}.
                </span>
                <span className="text-gray-300 flex-1">
                  {p.player?.name || "Unknown"}
                </span>
                {p.isCaptain && (
                  <span className="text-amber-400 text-xs font-bold bg-amber-950/50 px-1.5 py-0.5 rounded">
                    C
                  </span>
                )}
                {p.isWicketKeeper && (
                  <span className="text-blue-400 text-xs font-bold bg-blue-950/50 px-1.5 py-0.5 rounded">
                    WK
                  </span>
                )}
              </div>
            ))}
        </div>
        {team.players?.length === 0 && (
          <p className="text-xs text-gray-600 text-center py-2">
            No players added
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          size="xs"
          variant="danger"
          onClick={() => onDelete(team._id)}
          icon={MdDelete}
        >
          Delete
        </Button>
        <span className="text-xs text-gray-600 ml-auto">
          Created {new Date(team.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

const TeamManagementPage = () => {
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const {
    data,
    isLoading,
    refetch,
    isFetching,
  } = useGetAllTeamsQuery({});

  const [deleteTeam, { isLoading: isDeleting }] = useDeleteTeamMutation();

  const teams = data?.data || [];

  const filtered = teams.filter(
    (t) =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.captain?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (teamId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this team? This action cannot be undone."
      )
    )
      return;
    try {
      await deleteTeam(teamId).unwrap();
      toast.success("Team deleted successfully");
    } catch {
      toast.error("Failed to delete team");
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    refetch();
    toast.success("Team created! You can now use it in matches.");
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
              <MdGroup className="text-cricket-green" />
              Team Management
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {teams.length} team{teams.length !== 1 ? "s" : ""} total
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
            Create Team
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="stat-box text-center">
          <p className="stat-value text-xl text-cricket-green">
            {teams.length}
          </p>
          <p className="stat-label">Total Teams</p>
        </div>
        <div className="stat-box text-center">
          <p className="stat-value text-xl text-blue-400">
            {teams.reduce((acc, t) => acc + (t.players?.length || 0), 0)}
          </p>
          <p className="stat-label">Total Players</p>
        </div>
        <div className="stat-box text-center">
          <p className="stat-value text-xl text-amber-400">
            {teams.filter((t) => t.players?.length === 11).length}
          </p>
          <p className="stat-label">Full Teams</p>
        </div>
      </div>

      {/* Search */}
      <Input
        placeholder="Search by team name or captain..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        icon={MdSearch}
      />

      {/* Teams Grid */}
      {isLoading ? (
        <Loader text="Loading teams..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 card">
          <MdGroup className="text-gray-700 text-6xl mx-auto mb-4" />
          <p className="text-gray-500 text-base font-semibold">
            {search ? "No teams match your search" : "No teams created yet"}
          </p>
          <p className="text-gray-600 text-sm mt-1 mb-6">
            {search
              ? "Try a different search term"
              : "Teams are created automatically with each match, or you can create one manually"}
          </p>
          {!search && (
            <Button
              icon={MdAdd}
              onClick={() => setShowCreateModal(true)}
            >
              Create First Team
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((team) => (
            <TeamCard
              key={team._id}
              team={team}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Create Team Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Team"
        size="lg"
      >
        <TeamForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
};

export default TeamManagementPage;