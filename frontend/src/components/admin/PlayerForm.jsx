import React, { useState } from "react";
import { MdPerson, MdAdd } from "react-icons/md";
import { useCreatePlayerMutation } from "../../features/player/playerApi";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import toast from "react-hot-toast";

const roleOptions = [
  { value: "batsman", label: "Batsman" },
  { value: "bowler", label: "Bowler" },
  { value: "all_rounder", label: "All Rounder" },
  { value: "wicket_keeper", label: "Wicket Keeper" },
  { value: "unknown", label: "Unknown" },
];

const battingStyleOptions = [
  { value: "right_hand", label: "Right Hand" },
  { value: "left_hand", label: "Left Hand" },
];

const PlayerForm = ({ onSuccess, onCancel }) => {
  const [createPlayer, { isLoading }] = useCreatePlayerMutation();

  const [formData, setFormData] = useState({
    name: "",
    role: "unknown",
    battingStyle: "",
    bowlingStyle: "",
    jerseyNumber: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Player name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        name: formData.name.trim(),
        role: formData.role || "unknown",
        battingStyle: formData.battingStyle || "",
        bowlingStyle: formData.bowlingStyle || "",
        jerseyNumber: formData.jerseyNumber
          ? parseInt(formData.jerseyNumber)
          : undefined,
      };

      await createPlayer(payload).unwrap();
      toast.success(`${formData.name} added successfully!`);
      onSuccess?.();

      setFormData({
        name: "",
        role: "unknown",
        battingStyle: "",
        bowlingStyle: "",
        jerseyNumber: "",
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create player");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <MdPerson className="text-cricket-green text-xl" />
        <h3 className="text-base font-bold text-white">Add New Player</h3>
      </div>

      {/* Name */}
      <Input
        label="Player Name"
        name="name"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        placeholder="Enter player name"
        error={errors.name}
        required
      />

      {/* Role & Jersey */}
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Player Role"
          name="role"
          value={formData.role}
          onChange={(e) => handleChange("role", e.target.value)}
          options={roleOptions}
          placeholder="Select role"
        />
        <Input
          label="Jersey Number"
          name="jerseyNumber"
          type="number"
          value={formData.jerseyNumber}
          onChange={(e) => handleChange("jerseyNumber", e.target.value)}
          placeholder="e.g. 7"
          min={0}
          max={999}
          hint="Optional"
        />
      </div>

      {/* Batting Style */}
      <Select
        label="Batting Style"
        name="battingStyle"
        value={formData.battingStyle}
        onChange={(e) => handleChange("battingStyle", e.target.value)}
        options={battingStyleOptions}
        placeholder="Select batting style (optional)"
      />

      {/* Bowling Style */}
      <Input
        label="Bowling Style"
        name="bowlingStyle"
        value={formData.bowlingStyle}
        onChange={(e) => handleChange("bowlingStyle", e.target.value)}
        placeholder="e.g. Right arm fast (optional)"
        hint="Optional"
      />

      {/* Preview Card */}
      {formData.name && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-2">Preview</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cricket-green/20 border border-cricket-green/30 flex items-center justify-center">
              <span className="text-cricket-green font-bold text-sm">
                {formData.jerseyNumber || formData.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                {formData.name}
              </p>
              <p className="text-gray-500 text-xs capitalize">
                {formData.role?.replace("_", " ") || "Unknown"}{" "}
                {formData.battingStyle &&
                  `· ${formData.battingStyle.replace("_", " ")}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          fullWidth
          loading={isLoading}
          icon={MdAdd}
        >
          Add Player
        </Button>
      </div>
    </form>
  );
};

export default PlayerForm;