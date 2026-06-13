import React, { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";

const RunOutModal = ({
  isOpen,
  onClose,
  onConfirm,
  striker,
  nonStriker,
  bowlingTeamPlayers = [],
  isLoading = false,
}) => {
  const [dismissedBatter, setDismissedBatter] = useState("");
  const [runsCompleted, setRunsCompleted] = useState(0);
  const [fielderId, setFielderId] = useState("");
  const [customFielderName, setCustomFielderName] = useState("");
  const [useCustomFielder, setUseCustomFielder] = useState(false);

  const handleConfirm = () => {
    if (!dismissedBatter) {
      return;
    }

    const dismissedPlayer =
      dismissedBatter === "striker" ? striker : nonStriker;

    // Get fielder name
    let fielderName = "";
    if (useCustomFielder) {
      fielderName = customFielderName.trim();
    } else if (fielderId) {
      const fielder = bowlingTeamPlayers.find((p) => p.player === fielderId);
      fielderName = fielder?.playerName || "";
    }

    onConfirm({
      dismissedBatterId: dismissedPlayer.player?._id || dismissedPlayer.player,
      dismissedBatterName: dismissedPlayer.playerName,
      runsCompleted: parseInt(runsCompleted) || 0,
      fielderName: fielderName,
    });

    // Reset state
    setDismissedBatter("");
    setRunsCompleted(0);
    setFielderId("");
    setCustomFielderName("");
    setUseCustomFielder(false);
  };

  const handleClose = () => {
    setDismissedBatter("");
    setRunsCompleted(0);
    setFielderId("");
    setCustomFielderName("");
    setUseCustomFielder(false);
    onClose();
  };

  const fielderOptions = bowlingTeamPlayers.map((p) => ({
    value: p.player,
    label: p.playerName,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="🏃 Run Out - Details"
      size="md"
      closable={true}
    >
      <div className="space-y-4">
        <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-3">
          <p className="text-red-300 text-sm font-semibold">
            ⚠️ Who is run out?
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Select the batter who was dismissed
          </p>
        </div>

        {/* Batter Selection */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setDismissedBatter("striker")}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
              dismissedBatter === "striker"
                ? "border-red-500 bg-red-950/30"
                : "border-gray-700 hover:border-gray-500"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🏏</span>
              <div className="text-left">
                <p className="font-bold text-white">
                  {striker?.playerName || "Striker"}
                </p>
                <p className="text-xs text-gray-500">
                  Striker · {striker?.runs}({striker?.balls}b)
                </p>
              </div>
            </div>
            {dismissedBatter === "striker" && (
              <span className="text-red-400 font-bold">✓ OUT</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setDismissedBatter("nonStriker")}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
              dismissedBatter === "nonStriker"
                ? "border-red-500 bg-red-950/30"
                : "border-gray-700 hover:border-gray-500"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🏃</span>
              <div className="text-left">
                <p className="font-bold text-white">
                  {nonStriker?.playerName || "Non-Striker"}
                </p>
                <p className="text-xs text-gray-500">
                  Non-Striker · {nonStriker?.runs}({nonStriker?.balls}b)
                </p>
              </div>
            </div>
            {dismissedBatter === "nonStriker" && (
              <span className="text-red-400 font-bold">✓ OUT</span>
            )}
          </button>
        </div>

        {/* Runs Completed */}
        <Input
          label="Runs Completed Before Run Out"
          name="runsCompleted"
          type="number"
          value={runsCompleted}
          onChange={(e) => setRunsCompleted(e.target.value)}
          min={0}
          max={6}
          placeholder="0"
          hint="Number of runs completed before the run out"
        />

        {/* Fielder Selection */}
        <div className="space-y-2">
          <label className="label">Who Did the Run Out?</label>

          {/* Toggle */}
          <div className="flex gap-1 bg-gray-800 rounded-lg p-1 mb-2">
            <button
              type="button"
              onClick={() => setUseCustomFielder(false)}
              className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                !useCustomFielder
                  ? "bg-cricket-green text-white"
                  : "text-gray-400"
              }`}
            >
              From Team
            </button>
            <button
              type="button"
              onClick={() => setUseCustomFielder(true)}
              className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                useCustomFielder
                  ? "bg-cricket-green text-white"
                  : "text-gray-400"
              }`}
            >
              Custom Name
            </button>
          </div>

          {!useCustomFielder ? (
            <Select
              value={fielderId}
              onChange={(e) => setFielderId(e.target.value)}
              options={fielderOptions}
              placeholder="Select fielder"
            />
          ) : (
            <Input
              value={customFielderName}
              onChange={(e) => setCustomFielderName(e.target.value)}
              placeholder="Enter fielder name"
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" fullWidth onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            fullWidth
            loading={isLoading}
            disabled={!dismissedBatter}
            onClick={handleConfirm}
          >
            Confirm Run Out
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RunOutModal;