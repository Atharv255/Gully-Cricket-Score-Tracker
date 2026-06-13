import React from "react";
import { Link } from "react-router-dom";
import {
  MdSportsCricket,
  MdLiveTv,
  MdSchedule,
  MdHistory,
  MdArrowForward,
  MdRefresh,
} from "react-icons/md";
import {
  useGetLiveMatchesQuery,
  useGetUpcomingMatchesQuery,
  useGetCompletedMatchesQuery,
} from "../../features/live/liveApi";
import LiveMatchCard from "../../components/viewer/LiveMatchCard";
import UpcomingMatchCard from "../../components/viewer/UpcomingMatchCard";
import CompletedMatchCard from "../../components/viewer/CompletedMatchCard";
import Loader from "../../components/common/Loader";

const SectionHeader = ({ icon: Icon, title, count, color, link }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <Icon className={`${color} text-xl`} />
      <h2 className="text-lg font-bold text-white">{title}</h2>
      {count > 0 && (
        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </div>
    {link && (
      <Link
        to={link}
        className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1"
      >
        View all <MdArrowForward size={14} />
      </Link>
    )}
  </div>
);

const HomePage = () => {
  const {
    data: liveData,
    isLoading: liveLoading,
    refetch: refetchLive,
  } = useGetLiveMatchesQuery(undefined, {
    pollingInterval: 60000, // Poll every 60 seconds instead of 30
  });

  const { data: upcomingData, isLoading: upcomingLoading } =
    useGetUpcomingMatchesQuery();

  const { data: completedData, isLoading: completedLoading } =
    useGetCompletedMatchesQuery({ limit: 4 });

  const liveMatches = liveData?.data?.matches || [];
  const upcomingMatches = upcomingData?.data?.matches || [];
  const completedMatches = completedData?.data || [];

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-cricket-green/20 border border-cricket-green/30 mb-4">
          <MdSportsCricket className="text-cricket-green text-5xl" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
          Gully Cricket
          <span className="text-cricket-green"> Live</span>
        </h1>
        <p className="text-gray-400 text-base max-w-md mx-auto">
          Real-time cricket scoring for your local matches. Follow every ball,
          every wicket, every run.
        </p>
      </div>

      {/* Live Matches */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <SectionHeader
            icon={MdLiveTv}
            title="Live Now"
            count={liveMatches.length}
            color="text-red-400"
          />
          <button
            onClick={refetchLive}
            className="text-gray-600 hover:text-gray-400 transition-colors"
          >
            <MdRefresh size={18} />
          </button>
        </div>

        {liveLoading ? (
          <Loader size="sm" text="Checking for live matches..." />
        ) : liveMatches.length === 0 ? (
          <div className="card text-center py-10">
            <MdLiveTv className="text-gray-700 text-5xl mx-auto mb-3" />
            <p className="text-gray-500 font-semibold">
              No live matches right now
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Check back soon or see upcoming matches below
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveMatches.map((match) => (
              <LiveMatchCard key={match._id} match={match} />
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Matches */}
      {(upcomingLoading || upcomingMatches.length > 0) && (
        <section>
          <SectionHeader
            icon={MdSchedule}
            title="Upcoming Matches"
            count={upcomingMatches.length}
            color="text-blue-400"
          />

          {upcomingLoading ? (
            <Loader size="sm" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingMatches.slice(0, 4).map((match) => (
                <UpcomingMatchCard key={match._id} match={match} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Completed Matches */}
      {(completedLoading || completedMatches.length > 0) && (
        <section>
          <SectionHeader
            icon={MdHistory}
            title="Recent Results"
            count={completedMatches.length}
            color="text-green-400"
          />

          {completedLoading ? (
            <Loader size="sm" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedMatches.slice(0, 4).map((match) => (
                <CompletedMatchCard key={match._id} match={match} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Empty State */}
      {!liveLoading &&
        !upcomingLoading &&
        !completedLoading &&
        liveMatches.length === 0 &&
        upcomingMatches.length === 0 &&
        completedMatches.length === 0 && (
          <div className="text-center py-20">
            <MdSportsCricket className="text-gray-800 text-8xl mx-auto mb-6" />
            <h2 className="text-xl font-bold text-gray-600 mb-2">
              No Matches Yet
            </h2>
            <p className="text-gray-700 text-sm">
              Ask the admin to create a match
            </p>
          </div>
        )}
    </div>
  );
};

export default HomePage;