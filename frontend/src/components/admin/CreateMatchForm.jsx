import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateMatchMutation } from "../../features/match/matchApi";
import Input from "../common/Input";
import Button from "../common/Button";
import TossForm from "./TossForm";
import toast from "react-hot-toast";
import { MdAdd, MdDelete, MdSportsCricket, MdCheck } from "react-icons/md";

const defaultState = {
  title: "",
  groundName: "",
  matchDate: "",
  totalOvers: 20,
  teamA: { name: "", captain: "", players: [""] },
  teamB: { name: "", captain: "", players: [""] },
  toss: { winner: "", decision: "" },
};

const StepIndicator = ({ currentStep, totalSteps }) => {
  const steps = [
    { label: "Match" },
    { label: "Team A" },
    { label: "Team B" },
    { label: "Toss" },
  ];

  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = currentStep > stepNumber;
        const isActive = currentStep === stepNumber;

        return (
          <React.Fragment key={stepNumber}>
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isCompleted
                    ? "bg-cricket-green text-white"
                    : isActive
                    ? "bg-cricket-green text-white ring-4 ring-cricket-green/30"
                    : "bg-gray-800 text-gray-500 border-2 border-gray-700"
                }`}
              >
                {isCompleted ? <MdCheck size={18} /> : stepNumber}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${
                  isActive
                    ? "text-cricket-green"
                    : isCompleted
                    ? "text-gray-400"
                    : "text-gray-600"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mb-4 mx-1 transition-all duration-300 ${
                  currentStep > stepNumber ? "bg-cricket-green" : "bg-gray-800"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const PlayerInputList = ({ players, onUpdate, onAdd, onRemove, error }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label className="label">
        Players ({players.filter((p) => p.trim()).length})
        <span className="text-red-400 ml-1">*</span>
      </label>
      <Button
        type="button"
        size="xs"
        variant="secondary"
        onClick={onAdd}
        icon={MdAdd}
      >
        Add
      </Button>
    </div>
    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
      {players.map((player, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="text-xs text-gray-600 w-5 text-right flex-shrink-0">
            {index + 1}.
          </span>
          <input
            type="text"
            value={player}
            onChange={(e) => onUpdate(index, e.target.value)}
            placeholder={`Player ${index + 1} name`}
            className="input-field flex-1 text-sm py-1.5"
          />
          {players.length > 1 && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-red-400 hover:text-red-300 p-1 transition-colors flex-shrink-0"
            >
              <MdDelete size={16} />
            </button>
          )}
        </div>
      ))}
    </div>
    {error && <p className="text-red-400 text-xs">⚠ {error}</p>}
  </div>
);

const CreateMatchForm = () => {
  const navigate = useNavigate();
  const [createMatch, { isLoading }] = useCreateMatchMutation();
  const [formData, setFormData] = useState(defaultState);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  // Generic field updater using dot notation path
  const updateField = (path, value) => {
    setFormData((prev) => {
      const keys = path.split(".");
      const updated = JSON.parse(JSON.stringify(prev));
      let curr = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        curr = curr[keys[i]];
      }
      curr[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const updatePlayer = (team, index, value) => {
    setFormData((prev) => {
      const players = [...prev[team].players];
      players[index] = value;
      return { ...prev, [team]: { ...prev[team], players } };
    });
  };

  const addPlayer = (team) => {
    setFormData((prev) => ({
      ...prev,
      [team]: { ...prev[team], players: [...prev[team].players, ""] },
    }));
  };

  const removePlayer = (team, index) => {
    if (formData[team].players.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      [team]: {
        ...prev[team],
        players: prev[team].players.filter((_, i) => i !== index),
      },
    }));
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!formData.title.trim()) newErrors.title = "Match title is required";
      if (!formData.groundName.trim())
        newErrors.groundName = "Ground name is required";
      if (!formData.matchDate) newErrors.matchDate = "Match date is required";
      if (!formData.totalOvers || formData.totalOvers < 1)
        newErrors.totalOvers = "Valid overs required (min 1)";
    }

    if (stepNumber === 2) {
      if (!formData.teamA.name.trim())
        newErrors.teamAName = "Team A name is required";
      if (!formData.teamA.captain.trim())
        newErrors.teamACaptain = "Captain name is required";
      if (formData.teamA.players.filter((p) => p.trim()).length < 2)
        newErrors.teamAPlayers = "At least 2 players required";
    }

    if (stepNumber === 3) {
      if (!formData.teamB.name.trim())
        newErrors.teamBName = "Team B name is required";
      if (!formData.teamB.captain.trim())
        newErrors.teamBCaptain = "Captain name is required";
      if (formData.teamB.players.filter((p) => p.trim()).length < 2)
        newErrors.teamBPlayers = "At least 2 players required";
    }

    if (stepNumber === 4) {
      if (!formData.toss.winner.trim())
        newErrors.tossWinner = "Toss winner is required";
      if (!formData.toss.decision)
        newErrors.tossDecision = "Toss decision is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    } else {
      toast.error("Please fill all required fields");
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) {
      toast.error("Please complete toss details");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      groundName: formData.groundName.trim(),
      matchDate: formData.matchDate,
      totalOvers: parseInt(formData.totalOvers),
      teamA: {
        name: formData.teamA.name.trim(),
        captain: formData.teamA.captain.trim(),
        players: formData.teamA.players.map((p) => p.trim()).filter((p) => p),
      },
      teamB: {
        name: formData.teamB.name.trim(),
        captain: formData.teamB.captain.trim(),
        players: formData.teamB.players.map((p) => p.trim()).filter((p) => p),
      },
      toss: {
        winner: formData.toss.winner,
        decision: formData.toss.decision,
      },
    };

    try {
      const result = await createMatch(payload).unwrap();
      toast.success("🏏 Match created successfully!");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create match");
    }
  };

  return (
    <div>
      {/* Step Indicator */}
      <StepIndicator currentStep={step} totalSteps={4} />

      <form onSubmit={handleSubmit}>
        {/* ===== STEP 1: MATCH DETAILS ===== */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <MdSportsCricket className="text-cricket-green text-2xl" />
              <div>
                <h2 className="text-lg font-bold text-white">Match Details</h2>
                <p className="text-xs text-gray-500">
                  Basic information about the match
                </p>
              </div>
            </div>

            <Input
              label="Match Title"
              name="title"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. Gully Cricket Championship Final 2024"
              error={errors.title}
              required
            />

            <Input
              label="Ground / Venue Name"
              name="groundName"
              value={formData.groundName}
              onChange={(e) => updateField("groundName", e.target.value)}
              placeholder="e.g. Sector 7 Ground, Mumbai"
              error={errors.groundName}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Match Date"
                name="matchDate"
                type="date"
                value={formData.matchDate}
                onChange={(e) => updateField("matchDate", e.target.value)}
                error={errors.matchDate}
                required
              />
              <Input
                label="Total Overs"
                name="totalOvers"
                type="number"
                value={formData.totalOvers}
                onChange={(e) =>
                  updateField("totalOvers", parseInt(e.target.value) || "")
                }
                min={1}
                max={999}
                error={errors.totalOvers}
                hint="No upper limit"
                required
              />
            </div>

            {/* Overs Quick Select */}
            <div>
              <p className="label">Quick Select Overs</p>
              <div className="flex gap-2 flex-wrap">
                {[5, 10, 15, 20, 30, 50, 75, 100].map((ov) => (
                  <button
                    key={ov}
                    type="button"
                    onClick={() => updateField("totalOvers", ov)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${
                      formData.totalOvers === ov
                        ? "border-cricket-green bg-cricket-green/20 text-cricket-green"
                        : "border-gray-700 text-gray-500 hover:border-gray-500"
                    }`}
                  >
                    {ov} ov
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                💡 You can enter any number of overs (1-999+)
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="button" onClick={handleNext} size="md">
                Next: Team A →
              </Button>
            </div>
          </div>
        )}

        {/* ===== STEP 2: TEAM A ===== */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏏</span>
              <div>
                <h2 className="text-lg font-bold text-white">Team A Details</h2>
                <p className="text-xs text-gray-500">
                  Enter first team information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Team Name"
                name="teamAName"
                value={formData.teamA.name}
                onChange={(e) => updateField("teamA.name", e.target.value)}
                placeholder="e.g. Mumbai Stars"
                error={errors.teamAName}
                required
              />
              <Input
                label="Captain Name"
                name="teamACaptain"
                value={formData.teamA.captain}
                onChange={(e) => updateField("teamA.captain", e.target.value)}
                placeholder="Captain's full name"
                error={errors.teamACaptain}
                required
              />
            </div>

            <PlayerInputList
              players={formData.teamA.players}
              onUpdate={(index, value) => updatePlayer("teamA", index, value)}
              onAdd={() => addPlayer("teamA")}
              onRemove={(index) => removePlayer("teamA", index)}
              error={errors.teamAPlayers}
            />

            {/* Player Count Badge */}
            <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2">
              <span className="text-xs text-gray-500">
                Players added:{" "}
                <strong className="text-white">
                  {formData.teamA.players.filter((p) => p.trim()).length}
                </strong>
                /11
              </span>
              {formData.teamA.players.filter((p) => p.trim()).length >= 11 && (
                <span className="text-xs text-cricket-green font-semibold">
                  ✓ Full team!
                </span>
              )}
            </div>

            <div className="flex justify-between pt-2">
              <Button type="button" variant="secondary" onClick={handleBack}>
                ← Back
              </Button>
              <Button type="button" onClick={handleNext}>
                Next: Team B →
              </Button>
            </div>
          </div>
        )}

        {/* ===== STEP 3: TEAM B ===== */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⚾</span>
              <div>
                <h2 className="text-lg font-bold text-white">Team B Details</h2>
                <p className="text-xs text-gray-500">
                  Enter second team information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Team Name"
                name="teamBName"
                value={formData.teamB.name}
                onChange={(e) => updateField("teamB.name", e.target.value)}
                placeholder="e.g. Delhi Kings"
                error={errors.teamBName}
                required
              />
              <Input
                label="Captain Name"
                name="teamBCaptain"
                value={formData.teamB.captain}
                onChange={(e) => updateField("teamB.captain", e.target.value)}
                placeholder="Captain's full name"
                error={errors.teamBCaptain}
                required
              />
            </div>

            <PlayerInputList
              players={formData.teamB.players}
              onUpdate={(index, value) => updatePlayer("teamB", index, value)}
              onAdd={() => addPlayer("teamB")}
              onRemove={(index) => removePlayer("teamB", index)}
              error={errors.teamBPlayers}
            />

            {/* Player Count Badge */}
            <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2">
              <span className="text-xs text-gray-500">
                Players added:{" "}
                <strong className="text-white">
                  {formData.teamA.players.filter((p) => p.trim()).length}
                </strong>
              </span>
              {formData.teamA.players.filter((p) => p.trim()).length >= 2 && (
                <span className="text-xs text-cricket-green font-semibold">
                  ✓ Ready to play
                </span>
              )}
            </div>

            <div className="flex justify-between pt-2">
              <Button type="button" variant="secondary" onClick={handleBack}>
                ← Back
              </Button>
              <Button type="button" onClick={handleNext}>
                Next: Toss →
              </Button>
            </div>
          </div>
        )}

        {/* ===== STEP 4: TOSS ===== */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <TossForm
              teamAName={formData.teamA.name || "Team A"}
              teamBName={formData.teamB.name || "Team B"}
              value={formData.toss}
              onChange={(tossData) => updateField("toss", tossData)}
              errors={errors}
            />

            {/* Match Summary */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Match Summary
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Title</p>
                  <p className="text-white font-medium truncate">
                    {formData.title}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Venue</p>
                  <p className="text-white font-medium truncate">
                    {formData.groundName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Overs</p>
                  <p className="text-white font-medium">
                    {formData.totalOvers} overs
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Date</p>
                  <p className="text-white font-medium">{formData.matchDate}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Team A</p>
                  <p className="text-white font-medium">
                    {formData.teamA.name} (
                    {formData.teamA.players.filter((p) => p.trim()).length}{" "}
                    players)
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Team B</p>
                  <p className="text-white font-medium">
                    {formData.teamB.name} (
                    {formData.teamB.players.filter((p) => p.trim()).length}{" "}
                    players)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button type="button" variant="secondary" onClick={handleBack}>
                ← Back
              </Button>
              <Button
                type="submit"
                loading={isLoading}
                icon={MdSportsCricket}
                disabled={!formData.toss.winner || !formData.toss.decision}
              >
                🏏 Create Match
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateMatchForm;
