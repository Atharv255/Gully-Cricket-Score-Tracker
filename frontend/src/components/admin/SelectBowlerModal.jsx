import React, { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";

const SelectBowlerModal = ({
  isOpen,
  onClose,
  availablePlayers = [],
  onSelect,
  isLoading = false,
  lastBowlerId = null,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handleSelect = () => {
    if (!selectedPlayer) return;
    onSelect(selectedPlayer);
    setSelectedPlayer(null);
  };

  const eligibleBowlers = availablePlayers.filter(
    (p) =>
      (p.player?._id || p.player)?.toString() !== lastBowlerId?.toString()
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Next Bowler"
      size="sm"
      closable={false}
    >
      <div className="space-y-3">
        <p className="text-sm text-gray-400">
          Select the bowler for the next over:
        </p>
        {lastBowlerId && (
          <p className="text-xs text-amber-400 bg-amber-950/30 border border-amber-900/30 rounded-lg px-3 py-2">
            ⚠ Previous bowler cannot bowl consecutive overs
          </p>
        )}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {eligibleBowlers.map((player) => {
            const pid = player.player?._id || player.player;
            const isLastBowler = pid?.toString() === lastBowlerId?.toString();

            return (
              <button
                key={pid}
                type="button"
                disabled={isLastBowler}
                onClick={() =>
                  setSelectedPlayer({
                    playerId: pid,
                    playerName: player.playerName,
                  })
                }
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                  selectedPlayer?.playerId === pid
                    ? "border-cricket-green bg-cricket-green/10 text-white"
                    : isLastBowler
                    ? "border-gray-800 text-gray-600 opacity-40 cursor-not-allowed"
                    : "border-gray-700 hover:border-gray-500 text-gray-300"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-sm">⚾</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{player.playerName}</p>
                  {player.overs !== undefined && (
                    <p className="text-xs text-gray-500">
                      {player.overs}.{player.balls || 0} ov | {player.runs}R | {player.wickets}W
                    </p>
                  )}
                </div>
                {selectedPlayer?.playerId === pid && (
                  <span className="text-cricket-green">✓</span>
                )}
                {isLastBowler && (
                  <span className="text-xs text-gray-600">Last over</span>
                )}
              </button>
            );
          })}
        </div>
        <Button
          fullWidth
          onClick={handleSelect}
          disabled={!selectedPlayer}
          loading={isLoading}
          className="mt-2"
        >
          Confirm Bowler
        </Button>
      </div>
    </Modal>
  );
};

export default SelectBowlerModal;