import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdArrowBack, MdSearch, MdSportsCricket } from "react-icons/md";
import { useGetAllMatchesQuery } from "../../features/match/matchApi";
import CompletedMatchCard from "../../components/viewer/CompletedMatchCard";
import Loader from "../../components/common/Loader";
import Input from "../../components/common/Input";

const MatchHistoryPage = () => {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetAllMatchesQuery({ status: "completed" });

  const matches = data?.data || [];

  const filtered = matches.filter(
    (m) =>
      m.title?.toLowerCase().includes(search.toLowerCase()) ||
      m.teamA?.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.teamB?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/dashboard"
          className="text-gray-400 hover:text-white transition-colors"
        >
          <MdArrowBack size={22} />
        </Link>
        <div>
          <h1 className="text-xl font-black text-white">Match History</h1>
          <p className="text-gray-500 text-sm">All completed matches</p>
        </div>
      </div>

      {/* Search */}
      <Input
        placeholder="Search matches..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        icon={MdSearch}
      />

      {/* Matches */}
      {isLoading ? (
        <Loader text="Loading history..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 card">
          <MdSportsCricket className="text-gray-700 text-6xl mx-auto mb-4" />
          <p className="text-gray-500">
            {search ? "No matches found for your search" : "No completed matches yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((match) => (
            <CompletedMatchCard key={match._id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchHistoryPage;