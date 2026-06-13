module.exports = {
  // Match Status
  MATCH_STATUS: {
    UPCOMING: "upcoming",
    LIVE: "live",
    COMPLETED: "completed",
    ABANDONED: "abandoned",
  },

  // Innings Status
  INNINGS_STATUS: {
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
  },

  // Extra Types
  EXTRA_TYPES: {
    WIDE: "wide",
    NO_BALL: "no_ball",
    BYE: "bye",
    LEG_BYE: "leg_bye",
    NONE: "none",
  },

  // Wicket Types
  WICKET_TYPES: {
    BOWLED: "bowled",
    CAUGHT: "caught",
    RUN_OUT: "run_out",
    LBW: "lbw",
    STUMPED: "stumped",
    HIT_WICKET: "hit_wicket",
    RETIRED_HURT: "retired_hurt",
    NONE: "none",
  },

  // Ball Types
  BALL_TYPES: {
    NORMAL: "normal",
    EXTRA: "extra",
    WICKET: "wicket",
  },

  // Socket Events
  SOCKET_EVENTS: {
    // Score Updates
    SCORE_UPDATED: "score_updated",
    WICKET_FELL: "wicket_fell",
    OVER_COMPLETED: "over_completed",
    INNINGS_ENDED: "innings_ended",
    MATCH_ENDED: "match_ended",

    // Player Changes
    BATSMAN_CHANGED: "batsman_changed",
    BOWLER_CHANGED: "bowler_changed",

    // Match Events
    MATCH_STARTED: "match_started",
    MATCH_UPDATED: "match_updated",

    // Ball Events
    BALL_RECORDED: "ball_recorded",
    BALL_UNDONE: "ball_undone",

    // Commentary
    COMMENTARY_ADDED: "commentary_added",

    // Live Score
    LIVE_SCORE: "live_score",
  },

  // Player Status
  PLAYER_STATUS: {
    YET_TO_BAT: "yet_to_bat",
    BATTING: "batting",
    OUT: "out",
    RETIRED_HURT: "retired_hurt",
    NOT_OUT: "not_out",
  },

  // Match Result Types
  RESULT_TYPES: {
    WIN_BY_RUNS: "win_by_runs",
    WIN_BY_WICKETS: "win_by_wickets",
    TIE: "tie",
    ABANDONED: "abandoned",
    NO_RESULT: "no_result",
  },

  // Toss Decisions
  TOSS_DECISIONS: {
    BAT: "bat",
    BOWL: "bowl",
  },
};