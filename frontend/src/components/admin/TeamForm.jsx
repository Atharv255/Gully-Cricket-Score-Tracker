import React, { useState } from "react";
import { MdAdd, MdDelete, MdGroup } from "react-icons/md";
import { useCreateTeamMutation } from "../../features/team/teamApi";
import Input from "../common/Input";
import Button from "../common/Button";
import toast from "react-hot-toast";

const TeamForm = ({ onSuccess, onCancel }) => {
  const [createTeam, { isLoading }] = useCreateTeamMutation();

  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    captain: "",
    players: [""],
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const updatePlayer = (index, value) => {
    const updated = [...formData.players];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, players: updated }));
  };

  const addPlayer = () => {
    if (formData.players.length >= 11) {
      toast.error("Maximum 11 players allowed");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      players: [...prev.players, ""],
    }));
  };

  const removePlayer = (index) => {
    if (formData.players.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      players: prev.players.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Team name is required";
    if (!formData.captain.trim()) newErrors.captain = "Captain name is required";
    if (formData.players.filter((p) => p.trim()).length < 2) {
      newErrors.players = "At least 2 players required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        name: formData.name,
        shortName:
          formData.shortName || formData.name.substring(0, 3).toUpperCase(),
        captain: formData.captain,
        players: formData.players.filter((p) => p.trim()),
      };

      await createTeam(payload).unwrap();
      toast.success("Team created successfully!");
      onSuccess?.();

      setFormData({ name: "", shortName: "", captain: "", players: [""] });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create team");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <MdGroup className="text-cricket-green text-xl" />
        <h3 className="text-base font-bold text-white">Create New Team</h3>
      </div>

      {/* Team Name */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Team Name"
          name="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="e.g. Mumbai Stars"
          error={errors.name}
          required
        />
        <Input
          label="Short Name"
          name="shortName"
          value={formData.shortName}
          onChange={(e) =>
            handleChange("shortName", e.target.value.toUpperCase())
          }
          placeholder="e.g. MUM"
          hint="Max 5 characters"
          maxLength={5}
        />
      </div>

      {/* Captain */}
      <Input
        label="Captain Name"
        name="captain"
        value={formData.captain}
        onChange={(e) => handleChange("captain", e.target.value)}
        placeholder="Enter captain's name"
        error={errors.captain}
        required
      />

      {/* Players */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="label">
            Players ({formData.players.filter((p) => p.trim()).length}/11)
            <span className="text-red-400 ml-1">*</span>
          </label>
          <Button
            type="button"
            size="xs"
            variant="secondary"
            onClick={addPlayer}
            icon={MdAdd}
            disabled={formData.players.length >= 11}
          >
            Add Player
          </Button>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {formData.players.map((player, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-xs text-gray-600 w-5 text-right flex-shrink-0">
                {index + 1}.
              </span>
              <input
                type="text"
                value={player}
                onChange={(e) => updatePlayer(index, e.target.value)}
                placeholder={`Player ${index + 1} name`}
                className="input-field flex-1 text-sm py-1.5"
              />
              {formData.players.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePlayer(index)}
                  className="text-red-400 hover:text-red-300 p-1 transition-colors flex-shrink-0"
                >
                  <MdDelete size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {errors.players && (
          <p className="text-red-400 text-xs">⚠ {errors.players}</p>
        )}
      </div>

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
        <Button type="submit" fullWidth loading={isLoading} icon={MdGroup}>
          Create Team
        </Button>
      </div>
    </form>
  );
};

export default TeamForm;