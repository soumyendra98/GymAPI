const BaseUseCase = require("../BaseUseCase");
const AdminStatsStrategy = require("../strategies/stats/AdminStatsStrategy");
const MemberStatsStrategy = require("../strategies/stats/MemberStatsStrategy");
const InstructorStatsStrategy = require("../strategies/stats/InstructorStatsStrategy");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../constants/App");
const logger = require("../../utils/logger");
const { UserRoles } = require("../../constants/Users");

module.exports = class GetStatsUseCase extends BaseUseCase {
  constructor(request, response) {
    super(request, response);

    this.request = request;
    this.response = response;
  }

  async execute() {
    try {
      const { user } = this.request;

      const { location } = this.request.query;

      let stats = {};

      if (user.role === UserRoles.ADMIN) {
        stats = await new AdminStatsStrategy(user, location).execute();
      }

      if (user.role === UserRoles.MEMBER) {
        stats = await new MemberStatsStrategy(user, location).execute();
      }

      if (user.role === UserRoles.INSTRUCTOR) {
        stats = await new InstructorStatsStrategy(user, location).execute();
      }

      return this.success({ data: stats });
    } catch (error) {
      logger.error("GetStatsUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
