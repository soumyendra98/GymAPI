const ActivityModel = require("../../models/Activity");
const BaseUseCase = require("../BaseUseCase");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../constants/App");
const logger = require("../../utils/logger");

module.exports = class UpdateMembershipActivityUseCase extends BaseUseCase {
  constructor(request, response) {
    super(request, response);

    this.request = request;
    this.response = response;
  }

  async execute() {
    try {
      const { userId } = this.request;

      const {
        id: activityId,
        equipmentType = null,
        description = null,
        duration = null
      } = this.request.body;

      if (!activityId) {
        return this.error("Activity ID is required.");
      }

      const membershipActivity = await ActivityModel.findOneAndUpdate(
        { _id: activityId, user: userId },
        {
          equipmentType,
          description,
          duration
        },
        {
          new: true
        }
      );

      return this.success({
        data: membershipActivity,
        message: "Activity updated successfully!"
      });
    } catch (error) {
      logger.error("UpdateMembershipActivityUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
