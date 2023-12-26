const UsersModel = require("../../models/Users");
const MembersModel = require("../../models/Members");
const MembershipsModel = require("../../models/Memberships");
const BaseUseCase = require("../BaseUseCase");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../constants/App");
const logger = require("../../utils/logger");
const { UserRoles } = require("../../constants/Users");

module.exports = class EnrollUseCase extends BaseUseCase {
  constructor(request, response) {
    super(request, response);

    this.request = request;
    this.response = response;
  }

  async execute() {
    try {
      const { user } = this.request;

      const { planId, gymId, locationId, memberId = null } = this.request.body;

      if (!planId) {
        return this.error("Plan ID is required.");
      }

      if (!gymId) {
        return this.error("Gym ID is required.");
      }

      if (!locationId) {
        return this.error("Location ID is required.");
      }

      let memberUserId = "";

      if (!memberId) {
        const member = await new MembersModel({
          user: user._id,
          location: locationId,
          gym: gymId
        }).save();

        await UsersModel.findOneAndUpdate(
          { _id: user._id },
          { member: member._id }
        );

        memberUserId = member._id;
      } else {
        memberUserId = memberId;
      }

      const membership = await new MembershipsModel({
        member: memberUserId,
        plan: planId,
        location: locationId,
        gym: gymId
      }).save();

      return this.success({
        data: membership,
        message: "Enrolled successfully!"
      });
    } catch (error) {
      logger.error("EnrollUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
