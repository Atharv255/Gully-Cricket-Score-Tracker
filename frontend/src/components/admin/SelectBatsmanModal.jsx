import React, { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { MdSportsCricket } from "react-icons/md";

const SelectBatsmanModal = ({
  isOpen,
  onClose,
  availablePlayers = [],
  onSelect,
  isLoading = false,
  title = "Select New Batsman",
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handleSelect = () => {
    if (!selectedPlayer) return;
    onSelect(selectedPlayer);
    setSelectedPlayer(null);
  };

  const filteredPlayers = availablePlayers.filter(
    (p) => p.status === "yet_to_bat"
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      closable={false}
    >
      <div className="space-y-3">
        {filteredPlayers.length === 0 ? (
          <div className="text-center py-6">
            <MdSportsCricket className="text-gray-600 text-4xl mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No more batsmen available</p>
            <p className="text-gray-600 text-xs mt-1">All out!</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-3">
              Select the next batsman to come in:
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredPlayers.map((player) => (
                <button
                  key={player.player?._id || player.player}
                  type="button"
                  onClick={() =>
                    setSelectedPlayer({
                      playerId: player.player?._id || player.player,
                      playerName: player.playerName,
                    })
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                    selectedPlayer?.playerId ===
                    (player.player?._id || player.player)
                      ? "border-cricket-green bg-cricket-green/10 text-white"
                      : "border-gray-700 hover:border-gray-500 text-gray-300"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-300">
                    {player.battingOrder || "?"}
                  </div>
                  <span className="font-medium">{player.playerName}</span>
                  {selectedPlayer?.playerId ===
                    (player.player?._id || player.player) && (
                    <span className="ml-auto text-cricket-green">✓</span>
                  )}
                </button>
              ))}
            </div>
            <Button
              fullWidth
              onClick={handleSelect}
              disabled={!selectedPlayer}
              loading={isLoading}
              icon={MdSportsCricket}
              className="mt-4"
            >
              Confirm Selection
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default SelectBatsmanModal;