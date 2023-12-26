const ActivityModel = require("../../models/Activity");
const BaseUseCase = require("../BaseUseCase");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../constants/App");
const logger = require("../../utils/logger");

module.exports = class CreateGymActivityUseCase extends BaseUseCase {
  constructor(request, response) {
    super(request, response);

    this.request = request;
    this.response = response;
  }

  async execute() {
    try {
      const { type, gymId, memberUserId, locationId } = this.request.body;

      if (!type) {
        return this.error("Type is required.");
      }

      if (!gymId) {
        return this.error("Gym ID is required.");
      }

      if (!memberUserId) {
        return this.error("Member User ID is required.");
      }

      if (!locationId) {
        return this.error("Location ID is required.");
      }

      await new ActivityModel({
        type,
        user: memberUserId,
        location: locationId,
        gym: gymId
      }).save();

      return this.success({
        message: "Gym activity created successfully!"
      });
    } catch (error) {
      logger.error("CreateGymActivityUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
