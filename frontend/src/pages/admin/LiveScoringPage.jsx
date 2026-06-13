import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MdArrowBack, MdRefresh, MdSportsCricket } from "react-icons/md";
import { useGetMatchByIdQuery } from "../../features/match/matchApi";
import { useGetLiveScoreQuery } from "../../features/live/liveApi";
import ScoringPanel from "../../components/admin/ScoringPanel";
import TeamScore from "../../components/scoreboard/TeamScore";
import BatsmanCard from "../../components/scoreboard/BatsmanCard";
import BowlerCard from "../../components/scoreboard/BowlerCard";
import RecentBalls from "../../components/scoreboard/RecentBalls";
import PartnershipCard from "../../components/scoreboard/PartnershipCard";
import Loader from "../../components/common/Loader";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import useSocket from "../../hooks/useSocket";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentLiveScore,
  selectCurrentLiveScore,
} from "../../features/live/liveSlice";
import toast from "react-hot-toast";

const LiveScoringPage = () => {
  const { matchId } = useParams();
  const dispatch = useDispatch();
  const liveScore = useSelector(selectCurrentLiveScore);

  const {
    data: matchData,
    isLoading: matchLoading,
    refetch: refetchMatch,
  } = useGetMatchByIdQuery(matchId);

  const {
    data: liveData,
    isLoading: liveLoading,
    refetch: refetchLive,
  } = useGetLiveScoreQuery(matchId, {
    pollingInterval: 0,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: false,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (liveData?.data?.liveScore) {
      dispatch(setCurrentLiveScore(liveData.data.liveScore));
    }
  }, [liveData, dispatch]);

  useSocket(matchId, {
    onScoreUpdate: (data) => {
      if (data.liveScore) dispatch(setCurrentLiveScore(data.liveScore));
    },
    onBallRecorded: (data) => {
      if (data.liveScore) dispatch(setCurrentLiveScore(data.liveScore));
    },
    onOverComplete: (data) => {
      if (data.liveScore) dispatch(setCurrentLiveScore(data.liveScore));
      toast.success("Over completed! Select next bowler.", {
        icon: "✅",
        duration: 4000,
      });
    },
    onMatchEnd: (data) => {
      if (data.liveScore) dispatch(setCurrentLiveScore(data.liveScore));
      if (data.autoEnded) {
        toast.success("🏆 Match Completed Automatically!", {
          duration: 6000,
          style: {
            background: "#064e3b",
            color: "#a7f3d0",
            border: "1px solid #10b981",
            fontWeight: "bold",
            fontSize: "16px",
          },
        });
      }
      handleUpdate();
    },
  });

  const handleUpdate = () => {
    refetchLive();
    refetchMatch();
  };

  const match = matchData?.data?.match;
  const currentInnings = liveScore?.currentInnings;
  const innings = match?.innings?.[match.innings.length - 1];

  // Get team size for current batting team
  const getTeamSize = () => {
    if (!match || !innings) return 11;

    const battingTeamId = innings.battingTeam?._id || innings.battingTeam;
    const teamAId = match.teamA?.team?._id || match.teamA?.team;

    if (battingTeamId?.toString() === teamAId?.toString()) {
      return match.teamA?.team?.players?.length || 11;
    } else {
      return match.teamB?.team?.players?.length || 11;
    }
  };

  const teamSize =
    currentInnings?.totalPlayers || innings?.batters?.length || getTeamSize();

  const matchTotalOvers = currentInnings?.totalOvers || match?.totalOvers || 0;

  if (matchLoading || liveLoading)
    return <Loader text="Loading scoring panel..." />;

  if (!match) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Match not found</p>
        <Link to="/admin/dashboard" className="text-cricket-green text-sm">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Match is completed - show result page
  if (match.status === "completed") {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/admin/dashboard"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <MdArrowBack size={22} />
          </Link>
          <div>
            <h1 className="text-lg font-black text-white">{match.title}</h1>
            <p className="text-xs text-gray-500">Match Completed</p>
          </div>
        </div>

        {/* Match Result Banner */}
        <div className="bg-gradient-to-r from-cricket-green/20 to-cricket-darkgreen/20 border border-cricket-green/40 rounded-xl p-6 text-center mb-6">
          <div className="text-5xl mb-3">🏆</div>
          <h2 className="text-2xl font-black text-white mb-2">
            {match.result?.description || "Match Ended"}
          </h2>
          {match.result?.manOfTheMatch?.playerName && (
            <p className="text-amber-400 text-sm mt-3">
              ⭐ Man of the Match: {match.result.manOfTheMatch.playerName}
            </p>
          )}
        </div>

        {/* Innings Summary */}
        <div className="space-y-4">
          {match.innings?.map((inn, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4"
            >
              <p className="text-xs text-gray-500 mb-1">
                {index === 0 ? "1st Innings" : "2nd Innings"}
              </p>
              <h3 className="text-base font-bold text-white">
                {inn.battingTeamName}
              </h3>
              <p className="text-2xl font-black text-white font-mono mt-1">
                {inn.totalRuns}/{inn.wickets}
                <span className="text-sm text-gray-400 font-normal ml-2">
                  ({inn.oversCompleted}.{inn.ballsInCurrentOver} ov)
                </span>
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <Link to="/admin/dashboard" className="flex-1">
            <Button variant="secondary" fullWidth>
              Back to Dashboard
            </Button>
          </Link>
          <Link to={`/live/${matchId}`} target="_blank" className="flex-1">
            <Button fullWidth>View Public Page</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (match.status !== "live") {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <p className="text-gray-500 text-lg font-semibold mb-2">
          Match is not live
        </p>
        <p className="text-gray-600 text-sm mb-6">
          Status: <span className="capitalize">{match.status}</span>
        </p>
        <Link to="/admin/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/dashboard"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <MdArrowBack size={22} />
          </Link>
          <div>
            <h1 className="text-lg font-black text-white">{match.title}</h1>
            <p className="text-xs text-gray-500">
              Live Scoring Panel · {matchTotalOvers} Overs Match
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="live" pulse>
            LIVE
          </Badge>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleUpdate}
            icon={MdRefresh}
          >
            Refresh
          </Button>
          <Link to={`/live/${matchId}`} target="_blank">
            <Button size="sm" variant="outline">
              Viewer View
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Live Score View */}
        <div className="space-y-4">
          {liveScore?.previousInnings && (
            <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
              <p className="text-xs text-gray-500 mb-1">1st Innings</p>
              <p className="text-sm font-bold text-white">
                {liveScore.previousInnings.battingTeam}:{" "}
                <span className="font-mono">
                  {liveScore.previousInnings.totalRuns}/
                  {liveScore.previousInnings.wickets}
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  ({liveScore.previousInnings.overs} ov)
                </span>
              </p>
            </div>
          )}

          {currentInnings && (
            <>
              <TeamScore
                innings={currentInnings}
                totalPlayers={teamSize}
                totalOvers={matchTotalOvers}
              />
              <BatsmanCard
                striker={currentInnings.striker}
                nonStriker={currentInnings.nonStriker}
                onSelectBatsman={() => {
                  const event = new CustomEvent("openBatsmanModal");
                  window.dispatchEvent(event);
                }}
              />
              {currentInnings.currentBowler ? (
                <BowlerCard bowler={currentInnings.currentBowler} />
              ) : (
                <div className="card border-amber-700/50 bg-amber-950/20">
                  <p className="text-amber-400 text-sm text-center py-2">
                    ⚠️ No bowler selected
                  </p>
                </div>
              )}
              <PartnershipCard
                partnership={currentInnings.partnership}
                lastWicket={currentInnings.lastWicket}
              />
              <RecentBalls recentBalls={currentInnings.recentBalls} />
            </>
          )}
        </div>

        {/* Right - Scoring Panel */}
        <div>
          <div className="card sticky top-20">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              🏏 Scoring Panel
            </h2>
            {match.innings?.length > 0 ? (
              <ScoringPanel
                matchId={matchId}
                innings={match.innings[match.innings.length - 1]}
                match={match}
                onUpdate={handleUpdate}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">Innings not started yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveScoringPage;