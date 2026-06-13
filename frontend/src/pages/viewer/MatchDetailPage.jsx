import React from "react";
import { useParams, Link } from "react-router-dom";
import { MdArrowBack, MdShare } from "react-icons/md";
import { useGetMatchByIdQuery } from "../../features/match/matchApi";
import ScoreHeader from "../../components/scoreboard/ScoreHeader";
import ScorecardTable from "../../components/viewer/ScorecardTable";
import MatchResultBanner from "../../components/viewer/MatchResultBanner";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import toast from "react-hot-toast";

const MatchDetailPage = () => {
  const { matchId } = useParams();
  const { data, isLoading, isError } = useGetMatchByIdQuery(matchId);

  const match = data?.data?.match;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success("Link copied!");
    });
  };

  if (isLoading) return <Loader text="Loading match..." />;

  if (isError || !match) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Match not found</p>
        <Link to="/" className="text-cricket-green text-sm mt-2 block">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm"
        >
          <MdArrowBack size={18} />
          Home
        </Link>
        <Button
          size="xs"
          variant="outline"
          onClick={handleShare}
          icon={MdShare}
        >
          Share
        </Button>
      </div>

      <ScoreHeader match={match} />

      {match.status === "completed" && match.result && (
        <MatchResultBanner result={match.result} />
      )}

      {match.innings?.length > 0 && (
        <div className="space-y-4">
          {match.innings.map((innings) => (
            <ScorecardTable key={innings._id || innings} innings={innings} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchDetailPage;