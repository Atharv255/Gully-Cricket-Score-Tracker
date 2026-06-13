import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MdArrowBack,
  MdShare,
  MdRefresh,
  MdSportsCricket,
} from "react-icons/md";
import { useGetLiveScoreQuery } from "../../features/live/liveApi";
import { useGetMatchByIdQuery } from "../../features/match/matchApi";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentLiveScore,
  selectCurrentLiveScore,
} from "../../features/live/liveSlice";
import ScoreHeader from "../../components/scoreboard/ScoreHeader";
import TeamScore from "../../components/scoreboard/TeamScore";
import BatsmanCard from "../../components/scoreboard/BatsmanCard";
import BowlerCard from "../../components/scoreboard/BowlerCard";
import PartnershipCard from "../../components/scoreboard/PartnershipCard";
import RecentBalls from "../../components/scoreboard/RecentBalls";
import MatchResultBanner from "../../components/viewer/MatchResultBanner";
import CommentaryFeed from "../../components/scoreboard/CommentaryFeed";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import useSocket from "../../hooks/useSocket";
import toast from "react-hot-toast";

const LiveMatchPage = () => {
  const { matchId } = useParams();
  const dispatch = useDispatch();
  const liveScore = useSelector(selectCurrentLiveScore);
  const [commentary, setCommentary] = useState([]);
  const [activeTab, setActiveTab] = useState("live");

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetLiveScoreQuery(matchId, {
    pollingInterval: 0,
    refetchOnMountOrArgChange: true,
  });

  // Also fetch full match data for team size and total overs
  const { data: matchData } = useGetMatchByIdQuery(matchId);

  useEffect(() => {
    if (data?.data?.liveScore) {
      dispatch(setCurrentLiveScore(data.data.liveScore));
    }
  }, [data, dispatch]);

  useSocket(matchId, {
    onScoreUpdate: (socketData) => {
      if (socketData.liveScore) {
        dispatch(setCurrentLiveScore(socketData.liveScore));
      }
    },
    onBallRecorded: (socketData) => {
      if (socketData.liveScore) {
        dispatch(setCurrentLiveScore(socketData.liveScore));
      }
    },
    onWicket: () => {},
    onOverComplete: () => {},
    onInningsEnd: () => {},
    onMatchEnd: () => {},
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success("Match link copied!");
    });
  };

  if (isLoading && !liveScore) {
    return <Loader fullScreen text="Loading live score..." />;
  }

  if (isError && !liveScore) {
    return (
      <div className="text-center py-16">
        <MdSportsCricket className="text-gray-700 text-6xl mx-auto mb-4" />
        <p className="text-gray-500 text-lg font-semibold mb-2">
          Match not found
        </p>
        <Link to="/" className="text-cricket-green text-sm">
          ← Back to Home
        </Link>
      </div>
    );
  }

  const match = liveScore?.match;
  const currentInnings = liveScore?.currentInnings;
  const previousInnings = liveScore?.previousInnings;

  // Get full match details
  const fullMatch = matchData?.data?.match;
  const matchTotalOvers = fullMatch?.totalOvers || 0;

  // Get team size from match data
  const getTeamSize = () => {
    if (!fullMatch || !currentInnings) return 11;

    // Determine which team is batting
    const battingTeamName = currentInnings.battingTeam;
    const teamAName = fullMatch.teamA?.team?.name || fullMatch.teamA?.name;
    const teamBName = fullMatch.teamB?.team?.name || fullMatch.teamB?.name;

    if (battingTeamName === teamAName) {
      return fullMatch.teamA?.team?.players?.length || 11;
    } else if (battingTeamName === teamBName) {
      return fullMatch.teamB?.team?.players?.length || 11;
    }
    return 11;
  };

  const teamSize = getTeamSize();

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm"
        >
          <MdArrowBack size={18} />
          Home
        </Link>
        <div className="flex items-center gap-2">
          <Button
            size="xs"
            variant="ghost"
            onClick={refetch}
            icon={MdRefresh}
          >
            Refresh
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={handleShare}
            icon={MdShare}
          >
            Share
          </Button>
        </div>
      </div>

      {/* Score Header */}
      {match && <ScoreHeader match={match} liveScore={liveScore} />}

      {/* Result Banner */}
      {match?.status === "completed" && match?.result && (
        <MatchResultBanner result={match.result} />
      )}

      {/* Previous innings summary */}
      {previousInnings && (
        <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
          <p className="text-xs text-gray-500 mb-1">
            1st Innings - {previousInnings.battingTeam}
          </p>
          <p className="text-base font-bold text-white font-mono">
            {previousInnings.totalRuns}/{previousInnings.wickets}
            <span className="text-sm text-gray-400 font-normal ml-1">
              ({previousInnings.overs} ov)
            </span>
          </p>
        </div>
      )}

      {/* Current Innings */}
      {currentInnings ? (
        <>
       <TeamScore
  innings={currentInnings}
  totalPlayers={currentInnings.totalPlayers || teamSize}
  totalOvers={currentInnings.totalOvers || matchTotalOvers}
/>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-900 rounded-xl p-1 border border-gray-800">
            {[
              { value: "live", label: "🏏 Live" },
              { value: "commentary", label: "📢 Commentary" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab.value
                    ? "bg-cricket-green text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "live" ? (
            <div className="space-y-4 animate-fade-in">
              <BatsmanCard
                striker={currentInnings.striker}
                nonStriker={currentInnings.nonStriker}
              />
              <BowlerCard bowler={currentInnings.currentBowler} />
              <PartnershipCard
                partnership={currentInnings.partnership}
                lastWicket={currentInnings.lastWicket}
              />
              <RecentBalls recentBalls={currentInnings.recentBalls} />
            </div>
          ) : (
            <div className="animate-fade-in">
              <CommentaryFeed commentary={commentary} />
            </div>
          )}
        </>
      ) : (
        <div className="card text-center py-12">
          <MdSportsCricket className="text-gray-700 text-5xl mx-auto mb-3" />
          <p className="text-gray-500 font-semibold">
            {match?.status === "upcoming"
              ? "Match hasn't started yet"
              : "No innings data available"}
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveMatchPage;