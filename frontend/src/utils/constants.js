export const SOCKET_EVENTS = {
  SCORE_UPDATED: "score_updated",
  WICKET_FELL: "wicket_fell",
  OVER_COMPLETED: "over_completed",
  INNINGS_ENDED: "innings_ended",
  MATCH_ENDED: "match_ended",
  BATSMAN_CHANGED: "batsman_changed",
  BOWLER_CHANGED: "bowler_changed",
  MATCH_STARTED: "match_started",
  MATCH_UPDATED: "match_updated",
  BALL_RECORDED: "ball_recorded",
  BALL_UNDONE: "ball_undone",
  COMMENTARY_ADDED: "commentary_added",
  LIVE_SCORE: "live_score",
};

export const MATCH_STATUS = {
  UPCOMING: "upcoming",
  LIVE: "live",
  COMPLETED: "completed",
  ABANDONED: "abandoned",
};

export const EXTRA_TYPES = {
  WIDE: "wide",
  NO_BALL: "no_ball",
  BYE: "bye",
  LEG_BYE: "leg_bye",
  NONE: "none",
};

export const WICKET_TYPES = {
  BOWLED: "bowled",
  CAUGHT: "caught",
  RUN_OUT: "run_out",
  LBW: "lbw",
  STUMPED: "stumped",
  HIT_WICKET: "hit_wicket",
  RETIRED_HURT: "retired_hurt",
};

export const PLAYER_STATUS = {
  YET_TO_BAT: "yet_to_bat",
  BATTING: "batting",
  OUT: "out",
  RETIRED_HURT: "retired_hurt",
  NOT_OUT: "not_out",
};

export const RUN_OPTIONS = [0, 1, 2, 3, 4, 5, 6];

export const WICKET_OPTIONS = [
  { value: "bowled", label: "Bowled" },
  { value: "caught", label: "Caught" },
  { value: "run_out", label: "Run Out" },
  { value: "lbw", label: "LBW" },
  { value: "stumped", label: "Stumped" },
  { value: "hit_wicket", label: "Hit Wicket" },
];

export const EXTRA_OPTIONS = [
  { value: "wide", label: "Wide" },
  { value: "no_ball", label: "No Ball" },
  { value: "bye", label: "Bye" },
  { value: "leg_bye", label: "Leg Bye" },
];