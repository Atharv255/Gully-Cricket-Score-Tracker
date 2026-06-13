import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Input from "../common/Input";

const FielderSelectModal = ({
  isOpen,
  onClose,
  onConfirm,
  wicketType,
  bowlingTeamPlayers = [],
  isLoading = false,
}) => {
  const [selectedFielder, setSelectedFielder] = useState("");
  const [customFielderName, setCustomFielderName] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedFielder("");
      setCustomFielderName("");
      setUseCustom(false);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    const fielderName = useCustom
      ? customFielderName.trim()
      : bowlingTeamPlayers.find((p) => p.player === selectedFielder)
          ?.playerName;

    if (!fielderName) {
      return;
    }

    onConfirm({ fielderName });
  };

  const getTitle = () => {
    if (wicketType === "caught") return "🤲 Who Took the Catch?";
    if (wicketType === "stumped") return "🏏 Who Stumped?";
    if (wicketType === "run_out") return "🏃 Who Did the Run Out?";
    return "Select Fielder";
  };

  const getDescription = () => {
    if (wicketType === "caught")
      return "Select the fielder who caught the ball";
    if (wicketType === "stumped")
      return "Select the wicketkeeper who stumped";
    if (wicketType === "run_out")
      return "Select the fielder who threw/took the bails";
    return "Select fielder";
  };

  const isValid = useCustom ? customFielderName.trim() !== "" : selectedFielder !== "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      size="md"
    >
      <div className="space-y-4">
        <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-3">
          <p className="text-blue-300 text-sm font-semibold">
            ℹ️ {getDescription()}
          </p>
        </div>

        {/* Toggle between dropdown and custom */}
        <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setUseCustom(false)}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
              !useCustom
                ? "bg-cricket-green text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            From Team
          </button>
          <button
            type="button"
            onClick={() => setUseCustom(true)}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
              useCustom
                ? "bg-cricket-green text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Custom Name
          </button>
        </div>

        {/* Player Selection */}
        {!useCustom ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {bowlingTeamPlayers.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                No players available
              </p>
            ) : (
              bowlingTeamPlayers.map((player, index) => (
                <button
                  key={player.player || index}
                  type="button"
                  onClick={() => setSelectedFielder(player.player)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                    selectedFielder === player.player
                      ? "border-cricket-green bg-cricket-green/10"
                      : "border-gray-700 hover:border-gray-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-400">
                        {player.playerName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-semibold text-white text-sm">
                      {player.playerName}
                    </span>
                  </div>
                  {selectedFielder === player.player && (
                    <span className="text-cricket-green font-bold">✓</span>
                  )}
                </button>
              ))
            )}
          </div>
        ) : (
          <Input
            label="Fielder Name"
            value={customFielderName}
            onChange={(e) => setCustomFielderName(e.target.value)}
            placeholder="Enter fielder's name"
            required
          />
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Skip
          </Button>
          <Button
            fullWidth
            loading={isLoading}
            disabled={!isValid}
            onClick={handleConfirm}
          >
            Confirm Fielder
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FielderSelectModal;