const teamService = require("../services/team.service");
const ApiResponse = require("../utils/apiResponse");

class TeamController {
  async createTeam(req, res, next) {
    try {
      const team = await teamService.createTeam(req.body, req.user._id);
      return ApiResponse.created(res, { team }, "Team created successfully");
    } catch (error) {
      next(error);
    }
  }

  async getAllTeams(req, res, next) {
    try {
      const result = await teamService.getAllTeams(req.query);
      return ApiResponse.paginated(
        res,
        result.teams,
        result.pagination,
        "Teams fetched successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  async getTeamById(req, res, next) {
    try {
      const team = await teamService.getTeamById(req.params.teamId);
      return ApiResponse.success(res, { team }, "Team fetched successfully");
    } catch (error) {
      next(error);
    }
  }

  async updateTeam(req, res, next) {
    try {
      const team = await teamService.updateTeam(
        req.params.teamId,
        req.body
      );
      return ApiResponse.success(res, { team }, "Team updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async deleteTeam(req, res, next) {
    try {
      const result = await teamService.deleteTeam(req.params.teamId);
      return ApiResponse.success(res, result, "Team deleted successfully");
    } catch (error) {
      next(error);
    }
  }

  async addPlayerToTeam(req, res, next) {
    try {
      const team = await teamService.addPlayerToTeam(
        req.params.teamId,
        req.body
      );
      return ApiResponse.success(
        res,
        { team },
        "Player added to team successfully"
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TeamController();