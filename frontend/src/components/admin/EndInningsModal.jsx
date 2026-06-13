import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Select from "../common/Select";
import { MdSwapVert } from "react-icons/md";

const EndInningsModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  innings,
  match,
}) => {
  const [openingBatsmen, setOpeningBatsmen] = useState({
    striker: "",
    nonStriker: "",
  });
  const [openingBowler, setOpeningBowler] = useState({
    playerId: "",
    playerName: "",
  });

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setOpeningBatsmen({ striker: "", nonStriker: "" });
      setOpeningBowler({ playerId: "", playerName: "" });
    }
  }, [isOpen]);

  if (!isOpen || !match) return null;

  // For 2nd innings:
  // - Batting team = team that bowled in 1st innings (bowlingTeam of innings 1)
  // - Bowling team = team that batted in 1st innings (battingTeam of innings 1)

  const firstInningsBattingTeamId =
    innings?.battingTeam?._id || innings?.battingTeam;
  const firstInningsBowlingTeamId =
    innings?.bowlingTeam?._id || innings?.bowlingTeam;

  const teamAId = match.teamA?.team?._id || match.teamA?.team;
  const teamBId = match.teamB?.team?._id || match.teamB?.team;

  // Determine which team batting/bowling in 2nd innings
  let secondInningsBattingTeam, secondInningsBowlingTeam;
  let battingTeamPlayers = [];
  let bowlingTeamPlayers = [];

  if (firstInningsBowlingTeamId?.toString() === teamAId?.toString()) {
    secondInningsBattingTeam = match.teamA?.team;
    secondInningsBowlingTeam = match.teamB?.team;
    battingTeamPlayers = match.teamA?.team?.players || [];
    bowlingTeamPlayers = match.teamB?.team?.players || [];
  } else {
    secondInningsBattingTeam = match.teamB?.team;
    secondInningsBowlingTeam = match.teamA?.team;
    battingTeamPlayers = match.teamB?.team?.players || [];
    bowlingTeamPlayers = match.teamA?.team?.players || [];
  }

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

  const handleConfirm = () => {
    if (
      !openingBatsmen.striker ||
      !openingBatsmen.nonStriker ||
      !openingBowler.playerId
    ) {
      return;
    }
    onConfirm({ openingBatsmen, openingBowler });
  };

  const target = (innings?.totalRuns || 0) + 1;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Start 2nd Innings"
      size="md"
      closable={false}
    >
      <div className="space-y-5">
        {/* Summary */}
        {innings && (
          <div className="bg-cricket-green/10 border border-cricket-green/30 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-300">
              1st Innings:{" "}
              <span className="font-bold text-white text-lg">
                {innings.totalRuns}/{innings.wickets}
              </span>
            </p>
            <p className="text-xs text-cricket-green mt-1">
              Target:{" "}
              <span className="font-bold text-lg">{target}</span>
            </p>
          </div>
        )}

        {/* Innings Swap Visual */}
        <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
          <div className="flex items-center justify-around text-center">
            <div>
              <p className="text-xs text-gray-500">Now Batting</p>
              <p className="text-base font-bold text-cricket-green">
                {secondInningsBattingTeam?.name || "Team"}
              </p>
            </div>
            <MdSwapVert className="text-gray-500 text-2xl" />
            <div>
              <p className="text-xs text-gray-500">Now Bowling</p>
              <p className="text-base font-bold text-red-400">
                {secondInningsBowlingTeam?.name || "Team"}
              </p>
            </div>
          </div>
        </div>

        {/* Warning if no players */}
        {battingTeamPlayers.length === 0 && (
          <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-3">
            <p className="text-red-400 text-xs">
              ⚠️ No players found. Check match data.
            </p>
          </div>
        )}

        {/* Opening Batsmen Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gray-300">
            🏏 Opening Batsmen ({secondInningsBattingTeam?.name})
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
              !openingBatsmen.striker
                ? "Select striker first"
                : "Select non-striker"
            }
            required
            disabled={
              battingTeamPlayers.length === 0 || !openingBatsmen.striker
            }
          />
        </div>

        {/* Opening Bowler Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gray-300">
            ⚾ Opening Bowler ({secondInningsBowlingTeam?.name})
          </h4>

          <Select
            label="Select Bowler"
            value={openingBowler.playerId}
            onChange={(e) => {
              const playerData = bowlingTeamPlayers.find(
                (p) => (p.player?._id || p.player) === e.target.value
              );
              setOpeningBowler({
                playerId: e.target.value,
                playerName: playerData?.player?.name || "",
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
                Ready for 2nd Innings
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

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button
            fullWidth
            onClick={handleConfirm}
            loading={isLoading}
            disabled={
              !openingBatsmen.striker ||
              !openingBatsmen.nonStriker ||
              !openingBowler.playerId
            }
          >
            Start 2nd Innings
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EndInningsModal;