import React, { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Input from "../common/Input";

const RunOutModal = ({
  isOpen,
  onClose,
  onConfirm,
  striker,
  nonStriker,
  isLoading = false,
}) => {
  const [dismissedBatter, setDismissedBatter] = useState("");
  const [runsCompleted, setRunsCompleted] = useState(0);
  const [fielderName, setFielderName] = useState("");

  const handleConfirm = () => {
    if (!dismissedBatter) {
      return;
    }

    const dismissedPlayer =
      dismissedBatter === "striker" ? striker : nonStriker;

    onConfirm({
      dismissedBatterId: dismissedPlayer.player?._id || dismissedPlayer.player,
      dismissedBatterName: dismissedPlayer.playerName,
      runsCompleted: parseInt(runsCompleted) || 0,
      fielderName: fielderName.trim(),
    });

    // Reset state
    setDismissedBatter("");
    setRunsCompleted(0);
    setFielderName("");
  };

  const handleClose = () => {
    setDismissedBatter("");
    setRunsCompleted(0);
    setFielderName("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="🏃 Run Out - Select Dismissed Batter"
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

        {/* Runs Completed Before Run Out */}
        <Input
          label="Runs Completed Before Run Out"
          name="runsCompleted"
          type="number"
          value={runsCompleted}
          onChange={(e) => setRunsCompleted(e.target.value)}
          min={0}
          max={6}
          placeholder="0"
          hint="Number of runs completed before the run out (usually 0 or 1)"
        />

        {/* Fielder Name */}
        <Input
          label="Fielder Name (Optional)"
          name="fielderName"
          value={fielderName}
          onChange={(e) => setFielderName(e.target.value)}
          placeholder="e.g. Ravindra Jadeja"
          hint="Who threw/caught the ball"
        />

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