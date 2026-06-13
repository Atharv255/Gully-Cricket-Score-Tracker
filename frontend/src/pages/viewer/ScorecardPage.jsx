import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MdArrowBack,
  MdShare,
  MdFileDownload,
  MdSportsCricket,
} from "react-icons/md";
import { useGetMatchByIdQuery } from "../../features/match/matchApi";
import ScorecardTable from "../../components/viewer/ScorecardTable";
import MatchResultBanner from "../../components/viewer/MatchResultBanner";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { formatDate } from "../../utils/formatters";
import { generateMatchPDF } from "../../utils/pdfExport";
import toast from "react-hot-toast";

const ScorecardPage = () => {
  const { matchId } = useParams();
  const [activeInnings, setActiveInnings] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { data, isLoading, isError } = useGetMatchByIdQuery(matchId);

  const match = data?.data?.match;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success("Link copied to clipboard!");
    });
  };

  const handleDownloadPDF = async () => {
    if (!match) {
      toast.error("Match data not available");
      return;
    }

    setIsGeneratingPDF(true);

    try {
      // Show loading toast
      const loadingToast = toast.loading("Generating PDF...");

      // Small delay for UI feedback
      await new Promise((resolve) => setTimeout(resolve, 300));

      const fileName = generateMatchPDF(match);

      toast.dismiss(loadingToast);
      toast.success(`📄 PDF downloaded: ${fileName}`, {
        duration: 4000,
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error(error?.message || "Failed to generate PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (isLoading) return <Loader text="Loading scorecard..." />;

  if (isError || !match) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Match not found</p>
        <Link to="/" className="text-cricket-green text-sm block mt-2">
          ← Back to Home
        </Link>
      </div>
    );
  }

  const innings = match.innings || [];

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <MdArrowBack size={22} />
          </Link>
          <div>
            <h1 className="text-lg font-black text-white">{match.title}</h1>
            <p className="text-xs text-gray-500">
              {formatDate(match.matchDate)} · {match.groundName}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="xs"
            variant="outline"
            onClick={handleShare}
            icon={MdShare}
          >
            Share
          </Button>
          <Button
            size="xs"
            variant="secondary"
            onClick={handleDownloadPDF}
            loading={isGeneratingPDF}
            icon={MdFileDownload}
          >
            {isGeneratingPDF ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </div>

      {/* Result */}
      {match.result?.description && (
        <MatchResultBanner result={match.result} />
      )}

      {/* Match Summary */}
      <Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="stat-box">
            <p className="text-sm font-bold text-white">{match.teamA?.name}</p>
            <p className="stat-label">Team A</p>
          </div>
          <div className="stat-box">
            <p className="text-sm font-bold text-white">{match.teamB?.name}</p>
            <p className="stat-label">Team B</p>
          </div>
          <div className="stat-box">
            <p className="stat-value text-lg">{match.totalOvers}</p>
            <p className="stat-label">Overs</p>
          </div>
          <div className="stat-box">
            <p className="text-sm font-bold text-white capitalize">
              {match.toss?.winner}
            </p>
            <p className="stat-label">Toss Winner</p>
          </div>
        </div>
      </Card>

      {/* PDF Info Card */}
      <div className="bg-blue-950/30 border border-blue-900/50 rounded-xl p-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📄</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-300">
              Download Match Scorecard
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Get a professional PDF copy with full batting & bowling statistics,
              extras, and match result.
            </p>
          </div>
          <Button
            size="xs"
            variant="primary"
            onClick={handleDownloadPDF}
            loading={isGeneratingPDF}
            icon={MdFileDownload}
          >
            PDF
          </Button>
        </div>
      </div>

      {/* Innings Tabs */}
      {innings.length > 1 && (
        <div className="flex gap-1 bg-gray-900 rounded-xl p-1 border border-gray-800">
          {innings.map((inn, index) => (
            <button
              key={index}
              onClick={() => setActiveInnings(index)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeInnings === index
                  ? "bg-cricket-green text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {inn.battingTeamName || `Innings ${index + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Scorecard */}
      {innings.length > 0 ? (
        <ScorecardTable innings={innings[activeInnings]} />
      ) : (
        <div className="card text-center py-12">
          <MdSportsCricket className="text-gray-700 text-5xl mx-auto mb-3" />
          <p className="text-gray-500">No scorecard available</p>
          <p className="text-gray-600 text-sm mt-1">
            Match may not have started yet
          </p>
        </div>
      )}
    </div>
  );
};

export default ScorecardPage;