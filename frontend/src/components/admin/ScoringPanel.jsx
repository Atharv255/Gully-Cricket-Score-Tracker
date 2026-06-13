import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import RunButtons from "./RunButtons";
import ExtrasButtons from "./ExtrasButtons";
import WicketButtons from "./WicketButtons";
import OtherButtons from "./OtherButtons";
import SelectBatsmanModal from "./SelectBatsmanModal";
import SelectBowlerModal from "./SelectBowlerModal";
import EndInningsModal from "./EndInningsModal";
import MatchResultModal from "./MatchResultModal";
import RunOutModal from "./RunOutModal";
import FielderSelectModal from "./FielderSelectModal";
import {
  useRecordBallMutation,
  useSelectBatsmanMutation,
  useSelectBowlerMutation,
  useUndoLastBallMutation,
  useEndInningsMutation,
  useStartSecondInningsMutation,
  useEndMatchMutation,
} from "../../features/scoring/scoringApi";
import toast from "react-hot-toast";
import { showToast } from "../common/Toast";

const ScoringPanel = ({ matchId, innings, match, onUpdate }) => {
  const dispatch = useDispatch();
  const [selectedExtra, setSelectedExtra] = useState("");
  const [selectedWicket, setSelectedWicket] = useState("");
  const [showBatsmanModal, setShowBatsmanModal] = useState(false);
  const [showBowlerModal, setShowBowlerModal] = useState(false);
  const [showEndInningsModal, setShowEndInningsModal] = useState(false);
  const [showEndMatchModal, setShowEndMatchModal] = useState(false);
  const [showRunOutModal, setShowRunOutModal] = useState(false);
  const [showFielderModal, setShowFielderModal] = useState(false);
  const [pendingWicket, setPendingWicket] = useState(null);

  const [recordBall, { isLoading: isRecording }] = useRecordBallMutation();
  const [selectBatsman, { isLoading: isSelectingBatsman }] =
    useSelectBatsmanMutation();
  const [selectBowler, { isLoading: isSelectingBowler }] =
    useSelectBowlerMutation();
  const [undoBall, { isLoading: isUndoing }] = useUndoLastBallMutation();
  const [endInnings, { isLoading: isEndingInnings }] = useEndInningsMutation();
  const [startSecondInnings, { isLoading: isStartingSecond }] =
    useStartSecondInningsMutation();
  const [endMatch, { isLoading: isEndingMatch }] = useEndMatchMutation();

  const striker = innings?.batters?.find((b) => b.isStriker);
  const nonStriker = innings?.batters?.find(
    (b) => !b.isStriker && b.status === "batting"
  );
  const currentBowler = innings?.bowlers?.find((b) => b.isCurrentBowler);
  const availableBatsmen = innings?.batters || [];

  // CRITICAL: Detect missing players
  const noBowler = !currentBowler && !innings?.currentBowler;
  const noStriker = !striker && innings?.batters?.length > 0;
  const noNonStriker = !nonStriker && innings?.batters?.length > 0;

  // Check if innings is still active
  const inningsActive = innings?.status !== "completed";

  // Check if we can still bat (not all out)
  const maxWickets = (innings?.batters?.length || 11) - 1;
  const allOut = innings?.wickets >= maxWickets;
  const canBat = inningsActive && !allOut;

  const isDisabled =
    isRecording || isUndoing || !striker || !nonStriker || !currentBowler;

  // Get bowling team players from match data
  const getBowlingTeamPlayers = () => {
    if (!match || !innings) return [];

    const bowlingTeamId = innings.bowlingTeam?._id || innings.bowlingTeam;
    const teamAId = match.teamA?.team?._id || match.teamA?.team;
    const teamBId = match.teamB?.team?._id || match.teamB?.team;

    let players = [];
    if (bowlingTeamId?.toString() === teamAId?.toString()) {
      players = match.teamA?.team?.players || [];
    } else if (bowlingTeamId?.toString() === teamBId?.toString()) {
      players = match.teamB?.team?.players || [];
    }

    return players.map((p) => ({
      player: p.player?._id || p.player,
      playerName: p.player?.name || "Unknown",
    }));
  };

  const bowlingTeamPlayers = getBowlingTeamPlayers();

  // ===== AUTO-OPEN BOWLER MODAL =====
  useEffect(() => {
    if (
      noBowler &&
      match?.status === "live" &&
      !showBowlerModal &&
      !showBatsmanModal &&
      canBat
    ) {
      const timer = setTimeout(() => {
        setShowBowlerModal(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [noBowler, match?.status, showBatsmanModal, canBat]);

  // Listen for external request to open batsman modal
  useEffect(() => {
    const handleOpenBatsmanModal = () => {
      setShowBatsmanModal(true);
    };
    window.addEventListener("openBatsmanModal", handleOpenBatsmanModal);
    return () => {
      window.removeEventListener("openBatsmanModal", handleOpenBatsmanModal);
    };
  }, []);

  // ===== AUTO-OPEN BATSMAN MODAL (when striker missing) =====
  useEffect(() => {
    if (
      noStriker &&
      match?.status === "live" &&
      !showBatsmanModal &&
      !showBowlerModal &&
      !showFielderModal &&
      !showRunOutModal &&
      !showEndInningsModal &&
      canBat
    ) {
      const timer = setTimeout(() => {
        console.log("🏏 Auto-opening batsman modal - no striker found");
        setShowBatsmanModal(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [
    noStriker,
    match?.status,
    showBatsmanModal,
    showBowlerModal,
    showFielderModal,
    showRunOutModal,
    showEndInningsModal,
    canBat,
  ]);

  // ===== AUTO-OPEN BATSMAN MODAL (when non-striker missing - run out case) =====
  useEffect(() => {
    if (
      noNonStriker &&
      striker &&
      match?.status === "live" &&
      !showBatsmanModal &&
      !showBowlerModal &&
      canBat
    ) {
      const timer = setTimeout(() => {
        console.log("🏏 Auto-opening batsman modal - no non-striker");
        setShowBatsmanModal(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [
    noNonStriker,
    striker,
    match?.status,
    showBatsmanModal,
    showBowlerModal,
    canBat,
  ]);

  // ===== HANDLE RUN BUTTON CLICKS =====
  const handleRun = useCallback(
    async (runs) => {
      if (noStriker || noNonStriker) {
        toast.error("Please select batsman first");
        setShowBatsmanModal(true);
        return;
      }
      if (noBowler) {
        toast.error("Please select a bowler first");
        setShowBowlerModal(true);
        return;
      }

      const ballData = {
        matchId,
        runs,
        extraType: selectedExtra || "none",
        extraRuns:
          selectedExtra === "wide" || selectedExtra === "no_ball" ? 1 : 0,
        isWicket: false,
        wicketType: "none",
        strikerId: striker.player?._id || striker.player,
        nonStrikerId: nonStriker.player?._id || nonStriker.player,
        bowlerId: currentBowler.player?._id || currentBowler.player,
      };

      try {
        const result = await recordBall(ballData).unwrap();

        setSelectedExtra("");
        setSelectedWicket("");

        if (runs === 4) showToast.boundary(4, striker.playerName);
        if (runs === 6) showToast.boundary(6, striker.playerName);

        if (result.data?.inningsComplete) {
          if (match?.currentInnings === 1) {
            setTimeout(() => setShowEndInningsModal(true), 500);
          } else {
            setTimeout(() => setShowEndMatchModal(true), 500);
          }
        }

        onUpdate?.();
      } catch (error) {
        toast.error(error?.data?.message || "Failed to record ball");
      }
    },
    [
      matchId,
      striker,
      nonStriker,
      currentBowler,
      selectedExtra,
      recordBall,
      match,
      onUpdate,
      noBowler,
      noStriker,
      noNonStriker,
    ]
  );

  // ===== HANDLE WICKET BUTTON CLICKS =====
  const handleWicket = useCallback(
    async (wicketType) => {
      if (noStriker || noNonStriker) {
        toast.error("Please select batsman first");
        setShowBatsmanModal(true);
        return;
      }
      if (noBowler) {
        toast.error("Please select a bowler first");
        setShowBowlerModal(true);
        return;
      }

      // For run-out, show modal to ask WHO is out
      if (wicketType === "run_out") {
        setShowRunOutModal(true);
        return;
      }

      // For caught or stumped, ask who took the catch/stumping
      if (wicketType === "caught" || wicketType === "stumped") {
        setPendingWicket(wicketType);
        setShowFielderModal(true);
        return;
      }

      // For other wickets (bowled, lbw, hit_wicket), record directly
      const ballData = {
        matchId,
        runs: 0,
        extraType: "none",
        extraRuns: 0,
        isWicket: true,
        wicketType,
        strikerId: striker.player?._id || striker.player,
        nonStrikerId: nonStriker.player?._id || nonStriker.player,
        bowlerId: currentBowler.player?._id || currentBowler.player,
        dismissedBatterId: striker.player?._id || striker.player,
      };

      try {
        const result = await recordBall(ballData).unwrap();

        showToast.wicket(striker.playerName);
        setSelectedExtra("");
        setSelectedWicket("");

        if (result.data?.requireNewBatsman) {
          setTimeout(() => setShowBatsmanModal(true), 500);
        }

        if (result.data?.inningsComplete) {
          if (match?.currentInnings === 1) {
            setTimeout(() => setShowEndInningsModal(true), 500);
          } else {
            setTimeout(() => setShowEndMatchModal(true), 500);
          }
        }

        onUpdate?.();
      } catch (error) {
        toast.error(error?.data?.message || "Failed to record wicket");
      }
    },
    [
      matchId,
      striker,
      nonStriker,
      currentBowler,
      recordBall,
      match,
      onUpdate,
      noBowler,
      noStriker,
      noNonStriker,
    ]
  );

  // ===== HANDLE FIELDER SELECTED =====
  const handleFielderSelected = async ({ fielderName }) => {
    if (!pendingWicket) return;

    const ballData = {
      matchId,
      runs: 0,
      extraType: "none",
      extraRuns: 0,
      isWicket: true,
      wicketType: pendingWicket,
      strikerId: striker.player?._id || striker.player,
      nonStrikerId: nonStriker.player?._id || nonStriker.player,
      bowlerId: currentBowler.player?._id || currentBowler.player,
      dismissedBatterId: striker.player?._id || striker.player,
      fielderName: fielderName,
    };

    try {
      const result = await recordBall(ballData).unwrap();

      const wicketMsg =
        pendingWicket === "caught"
          ? `🤲 CAUGHT by ${fielderName}! ${striker.playerName} is OUT!`
          : `🏏 STUMPED by ${fielderName}! ${striker.playerName} is OUT!`;

      toast.error(wicketMsg, {
        duration: 4000,
        style: {
          background: "#450a0a",
          color: "#fca5a5",
          border: "1px solid #991b1b",
          fontWeight: "bold",
        },
      });

      setShowFielderModal(false);
      setPendingWicket(null);
      setSelectedExtra("");
      setSelectedWicket("");

      if (result.data?.requireNewBatsman) {
        setTimeout(() => setShowBatsmanModal(true), 500);
      }

      if (result.data?.inningsComplete) {
        if (match?.currentInnings === 1) {
          setTimeout(() => setShowEndInningsModal(true), 500);
        } else {
          setTimeout(() => setShowEndMatchModal(true), 500);
        }
      }

      onUpdate?.();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to record wicket");
    }
  };

  // ===== HANDLE SKIP FIELDER =====
  const handleSkipFielder = async () => {
    if (!pendingWicket) {
      setShowFielderModal(false);
      return;
    }

    const ballData = {
      matchId,
      runs: 0,
      extraType: "none",
      extraRuns: 0,
      isWicket: true,
      wicketType: pendingWicket,
      strikerId: striker.player?._id || striker.player,
      nonStrikerId: nonStriker.player?._id || nonStriker.player,
      bowlerId: currentBowler.player?._id || currentBowler.player,
      dismissedBatterId: striker.player?._id || striker.player,
    };

    try {
      const result = await recordBall(ballData).unwrap();
      showToast.wicket(striker.playerName);

      setShowFielderModal(false);
      setPendingWicket(null);
      setSelectedExtra("");
      setSelectedWicket("");

      if (result.data?.requireNewBatsman) {
        setTimeout(() => setShowBatsmanModal(true), 500);
      }

      if (result.data?.inningsComplete) {
        if (match?.currentInnings === 1) {
          setTimeout(() => setShowEndInningsModal(true), 500);
        } else {
          setTimeout(() => setShowEndMatchModal(true), 500);
        }
      }

      onUpdate?.();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to record wicket");
    }
  };

  // ===== HANDLE RUN OUT =====
  const handleRunOut = async (runOutData) => {
    const {
      dismissedBatterId,
      dismissedBatterName,
      runsCompleted,
      fielderName,
    } = runOutData;

    const ballData = {
      matchId,
      runs: parseInt(runsCompleted) || 0,
      extraType: "none",
      extraRuns: 0,
      isWicket: true,
      wicketType: "run_out",
      strikerId: striker.player?._id || striker.player,
      nonStrikerId: nonStriker.player?._id || nonStriker.player,
      bowlerId: currentBowler.player?._id || currentBowler.player,
      dismissedBatterId: dismissedBatterId,
      fielderName: fielderName || "",
    };

    try {
      const result = await recordBall(ballData).unwrap();

      const msg = fielderName
        ? `🏃 RUN OUT by ${fielderName}! ${dismissedBatterName} is out!`
        : `🏃 RUN OUT! ${dismissedBatterName} is out!`;

      toast.error(msg, {
        duration: 4000,
        style: {
          background: "#450a0a",
          color: "#fca5a5",
          border: "1px solid #991b1b",
          fontWeight: "bold",
        },
      });

      setShowRunOutModal(false);
      setSelectedExtra("");
      setSelectedWicket("");

      if (result.data?.requireNewBatsman) {
        setTimeout(() => setShowBatsmanModal(true), 500);
      }

      if (result.data?.inningsComplete) {
        if (match?.currentInnings === 1) {
          setTimeout(() => setShowEndInningsModal(true), 500);
        } else {
          setTimeout(() => setShowEndMatchModal(true), 500);
        }
      }

      onUpdate?.();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to record run out");
    }
  };

  // ===== HANDLE EXTRAS =====
  const handleExtra = useCallback((extraType) => {
    setSelectedExtra((prev) => (prev === extraType ? "" : extraType));
    setSelectedWicket("");
  }, []);

  // ===== HANDLE BATSMAN SELECTION =====
  const handleSelectBatsman = async (playerData) => {
    try {
      await selectBatsman({ matchId, ...playerData }).unwrap();
      setShowBatsmanModal(false);
      toast.success(`${playerData.playerName} is the new batsman`);
      onUpdate?.();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to select batsman");
    }
  };

  // ===== HANDLE BOWLER SELECTION =====
  const handleSelectBowler = async (playerData) => {
    try {
      await selectBowler({ matchId, ...playerData }).unwrap();
      setShowBowlerModal(false);
      toast.success(`${playerData.playerName} will bowl now`);
      onUpdate?.();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to select bowler");
    }
  };

  // ===== HANDLE UNDO =====
  const handleUndo = async () => {
    try {
      await undoBall(matchId).unwrap();
      toast.success("Last ball undone");
      onUpdate?.();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to undo");
    }
  };

  // ===== HANDLE END INNINGS =====
  const handleEndInnings = async () => {
    try {
      await endInnings(matchId).unwrap();
      toast.success("Innings ended");
      setShowEndInningsModal(true);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to end innings");
    }
  };

  // ===== HANDLE START SECOND INNINGS =====
  const handleStartSecondInnings = async (data) => {
    try {
      await startSecondInnings({ matchId, ...data }).unwrap();
      setShowEndInningsModal(false);
      toast.success("Second innings started!");
      onUpdate?.();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to start second innings");
    }
  };

  // ===== HANDLE END MATCH =====
  const handleEndMatch = async (resultData) => {
    try {
      await endMatch({ matchId, ...resultData }).unwrap();
      setShowEndMatchModal(false);
      toast.success("Match ended successfully!");
      onUpdate?.();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to end match");
    }
  };

  return (
    <>
      <div className="space-y-5">
        {/* Current State Display */}
        <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
          <div className="flex items-center gap-4 flex-wrap text-sm">
            <div>
              <span className="text-gray-500 text-xs">Striker: </span>
              <span
                className={`font-semibold ${
                  noStriker ? "text-red-400" : "text-white"
                }`}
              >
                {striker?.playerName || "Not set"}
              </span>
              {striker && (
                <span className="text-gray-400 text-xs ml-1">
                  ({striker.runs}/{striker.balls}b)
                </span>
              )}
              {noStriker && (
                <button
                  onClick={() => setShowBatsmanModal(true)}
                  className="ml-2 text-xs text-amber-400 hover:text-amber-300 underline"
                >
                  Select Now
                </button>
              )}
            </div>
            <div>
              <span className="text-gray-500 text-xs">Non-Striker: </span>
              <span
                className={`font-semibold ${
                  noNonStriker ? "text-red-400" : "text-white"
                }`}
              >
                {nonStriker?.playerName || "Not set"}
              </span>
              {nonStriker && (
                <span className="text-gray-400 text-xs ml-1">
                  ({nonStriker.runs}/{nonStriker.balls}b)
                </span>
              )}
              {noNonStriker && (
                <button
                  onClick={() => setShowBatsmanModal(true)}
                  className="ml-2 text-xs text-amber-400 hover:text-amber-300 underline"
                >
                  Select Now
                </button>
              )}
            </div>
            <div>
              <span className="text-gray-500 text-xs">Bowler: </span>
              <span
                className={`font-semibold ${
                  noBowler ? "text-red-400" : "text-white"
                }`}
              >
                {currentBowler?.playerName || "Not set"}
              </span>
              {noBowler && (
                <button
                  onClick={() => setShowBowlerModal(true)}
                  className="ml-2 text-xs text-amber-400 hover:text-amber-300 underline"
                >
                  Select Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* No Batsman Warning - PROMINENT */}
        {(noStriker || noNonStriker) && canBat && (
          <div className="bg-red-950/40 border border-red-700 rounded-lg p-4 text-center animate-pulse">
            <p className="text-red-300 text-sm font-bold mb-3">
              ⚠️ Batsman Required!{" "}
              {noStriker ? "Striker not set" : "Non-striker not set"}
            </p>
            <button
              onClick={() => setShowBatsmanModal(true)}
              className="btn-danger text-sm px-6 py-2"
            >
              🏏 Select Batsman Now
            </button>
          </div>
        )}

        {/* No Bowler Warning */}
        {noBowler && !noStriker && !noNonStriker && canBat && (
          <div className="bg-amber-950/40 border border-amber-700 rounded-lg p-3 text-center">
            <p className="text-amber-300 text-sm font-bold mb-2">
              ⚠️ Select a bowler to continue scoring
            </p>
            <button
              onClick={() => setShowBowlerModal(true)}
              className="btn-warning text-sm"
            >
              Select Bowler Now
            </button>
          </div>
        )}

        {/* All Out Warning */}
        {allOut && (
          <div className="bg-blue-950/40 border border-blue-700 rounded-lg p-3 text-center">
            <p className="text-blue-300 text-sm font-bold mb-2">
              🏏 All Out! Innings Complete
            </p>
            <button onClick={handleEndInnings} className="btn-primary text-sm">
              End Innings
            </button>
          </div>
        )}

        {/* Selected Extra Indicator */}
        {selectedExtra && !noBowler && !noStriker && (
          <div className="bg-amber-950/30 border border-amber-800/50 rounded-lg px-3 py-2 text-sm text-amber-400 font-medium flex items-center justify-between">
            <span>
              ⚠ Extra selected:{" "}
              <strong>{selectedExtra.replace("_", " ").toUpperCase()}</strong> —
              Now select runs
            </span>
            <button
              onClick={() => setSelectedExtra("")}
              className="text-amber-600 hover:text-amber-400 text-xs"
            >
              Clear
            </button>
          </div>
        )}

        {/* Run Buttons */}
        <RunButtons
          onRun={handleRun}
          disabled={isDisabled}
          selectedExtra={selectedExtra}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Extras */}
          <ExtrasButtons
            onExtra={handleExtra}
            disabled={isRecording || noBowler || noStriker}
            selectedExtra={selectedExtra}
          />

          {/* Wickets */}
          <WicketButtons
            onWicket={handleWicket}
            disabled={isDisabled}
            selectedWicket={selectedWicket}
          />
        </div>

        {/* Other Actions */}
        <OtherButtons
          onUndo={handleUndo}
          onEndInnings={handleEndInnings}
          onEndMatch={() => setShowEndMatchModal(true)}
          onRetiredHurt={() => setShowBatsmanModal(true)}
          disabled={isRecording || isUndoing}
        />
      </div>

      {/* ===== MODALS ===== */}

      {/* Select New Batsman Modal */}
      <SelectBatsmanModal
        isOpen={showBatsmanModal}
        onClose={() => setShowBatsmanModal(false)}
        availablePlayers={availableBatsmen}
        onSelect={handleSelectBatsman}
        isLoading={isSelectingBatsman}
      />

      {/* Select New Bowler Modal */}
      <SelectBowlerModal
        isOpen={showBowlerModal}
        onClose={() => setShowBowlerModal(false)}
        availablePlayers={bowlingTeamPlayers}
        onSelect={handleSelectBowler}
        isLoading={isSelectingBowler}
        lastBowlerId={innings?.lastBowler}
      />

      {/* End Innings / Start 2nd Innings Modal */}
      <EndInningsModal
        isOpen={showEndInningsModal}
        onClose={() => setShowEndInningsModal(false)}
        onConfirm={handleStartSecondInnings}
        isLoading={isStartingSecond}
        innings={innings}
        match={match}
      />

      {/* End Match / Match Result Modal */}
      <MatchResultModal
        isOpen={showEndMatchModal}
        onClose={() => setShowEndMatchModal(false)}
        onConfirm={handleEndMatch}
        isLoading={isEndingMatch}
        match={match}
        innings={innings}
      />

      {/* Run Out Modal */}
      <RunOutModal
        isOpen={showRunOutModal}
        onClose={() => setShowRunOutModal(false)}
        onConfirm={handleRunOut}
        striker={striker}
        nonStriker={nonStriker}
        bowlingTeamPlayers={bowlingTeamPlayers}
        isLoading={isRecording}
      />

      {/* Fielder Select Modal (for Caught/Stumped) */}
      <FielderSelectModal
        isOpen={showFielderModal}
        onClose={handleSkipFielder}
        onConfirm={handleFielderSelected}
        wicketType={pendingWicket}
        bowlingTeamPlayers={bowlingTeamPlayers}
        isLoading={isRecording}
      />
    </>
  );
};

export default ScoringPanel;
