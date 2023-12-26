const ActivityModel = require("../../models/Activity");
const BaseUseCase = require("../BaseUseCase");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../constants/App");
const logger = require("../../utils/logger");
const { UserRoles } = require("../../constants/Users");

module.exports = class GetActivityUseCase extends BaseUseCase {
  constructor(request, response) {
    super(request, response);

    this.request = request;
    this.response = response;
  }

  async execute() {
    try {
      const { user } = this.request;

      const { location } = this.request.query;

      const filter = { location };

      if (user.role === UserRoles.ADMIN) {
        filter.gym = user.gym._id;
      }

      if (user.role === UserRoles.MEMBER) {
        filter.user = user._id;
      }

      if (user.role === UserRoles.INSTRUCTOR) {
        filter.gym = user.instructor.gym;
      }

      const activity = await ActivityModel.find(filter)
        .sort({
          createdAt: -1
        })
        .populate("user gym")
        .populate({
          path: "membership",
          populate: {
            path: "plan"
          }
        })
        .populate({
          path: "membership",
          populate: {
            path: "gym"
          }
        });

      return this.success({ data: activity });
    } catch (error) {
      logger.error("GetActivityUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
