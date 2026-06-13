import React, { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Select from "../common/Select";
import Input from "../common/Input";

const resultTypes = [
  { value: "win_by_runs", label: "Win by Runs" },
  { value: "win_by_wickets", label: "Win by Wickets" },
  { value: "tie", label: "Tie" },
  { value: "abandoned", label: "Abandoned" },
];

const MatchResultModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  match,
  innings,
}) => {
  const [resultData, setResultData] = useState({
    manOfTheMatch: { playerName: "", teamName: "" },
  });

  const handleConfirm = () => {
    onConfirm(resultData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="End Match"
      size="md"
    >
      <div className="space-y-4">
        <div className="bg-gray-800/50 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">Match will be ended</p>
          {innings && (
            <p className="text-white font-bold mt-1">
              Final Score: {innings.totalRuns}/{innings.wickets} ({innings.oversCompleted}.{innings.ballsInCurrentOver} ov)
            </p>
          )}
        </div>

        <Input
          label="Man of the Match"
          value={resultData.manOfTheMatch.playerName}
          onChange={(e) =>
            setResultData((prev) => ({
              ...prev,
              manOfTheMatch: {
                ...prev.manOfTheMatch,
                playerName: e.target.value,
              },
            }))
          }
          placeholder="Player name"
        />

        <Input
          label="Man of the Match - Team"
          value={resultData.manOfTheMatch.teamName}
          onChange={(e) =>
            setResultData((prev) => ({
              ...prev,
              manOfTheMatch: {
                ...prev.manOfTheMatch,
                teamName: e.target.value,
              },
            }))
          }
          placeholder="Team name"
        />

        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button
            fullWidth
            variant="danger"
            onClick={handleConfirm}
            loading={isLoading}
          >
            End Match
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default MatchResultModal;