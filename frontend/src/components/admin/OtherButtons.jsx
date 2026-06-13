import React from "react";
import {
  MdUndo,
  MdSkipNext,
  MdSportsCricket,
  MdStop,
} from "react-icons/md";
import Button from "../common/Button";

const OtherButtons = ({
  onUndo,
  onEndOver,
  onRetiredHurt,
  onEndInnings,
  onEndMatch,
  disabled = false,
  isOverComplete = false,
}) => {
  return (
    <div>
      <p className="section-title">Other</p>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="secondary"
          onClick={onUndo}
          disabled={disabled}
          icon={MdUndo}
          size="sm"
        >
          Undo Ball
        </Button>

        <Button
          variant="warning"
          onClick={onRetiredHurt}
          disabled={disabled}
          icon={MdSportsCricket}
          size="sm"
        >
          Retired Hurt
        </Button>

        <Button
          variant="outline"
          onClick={onEndInnings}
          disabled={disabled}
          icon={MdSkipNext}
          size="sm"
        >
          End Innings
        </Button>

        <Button
          variant="danger"
          onClick={onEndMatch}
          disabled={disabled}
          icon={MdStop}
          size="sm"
        >
          End Match
        </Button>
      </div>
    </div>
  );
};

export default OtherButtons;