const MembershipsModel = require("../../models/Memberships");
const ActivityModel = require("../../models/Activity");
const BaseUseCase = require("../BaseUseCase");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../constants/App");
const logger = require("../../utils/logger");

module.exports = class CreateMembershipActivityUseCase extends BaseUseCase {
  constructor(request, response) {
    super(request, response);

    this.request = request;
    this.response = response;
  }

  async execute() {
    try {
      const { userId } = this.request;

      const {
        type,
        mId: membershipId = null,
        gId: gymId = null,
        equipmentType = null,
        description = null,
        duration = null
      } = this.request.body;

      if (!type) {
        return this.error("Type is required.");
      }

      const membership = await MembershipsModel.findById(membershipId);

      if (!membership) {
        return this.error("Membership does not exists.");
      }

      const membershipActivity = await new ActivityModel({
        type,
        membership: membershipId,
        location: membership.location,
        equipmentType,
        description,
        duration,
        user: userId,
        gym: gymId
      }).save();

      return this.success({
        data: membershipActivity,
        message: "Activity created successfully!"
      });
    } catch (error) {
      logger.error("CreateMembershipActivityUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
