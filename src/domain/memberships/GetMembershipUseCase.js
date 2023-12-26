const MembershipsModel = require("../../models/Memberships");
const ActivityModel = require("../../models/Activity");
const BaseUseCase = require("../BaseUseCase");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../constants/App");
const logger = require("../../utils/logger");

module.exports = class GetMembershipUseCase extends BaseUseCase {
  constructor(request, response) {
    super(request, response);

    this.request = request;
    this.response = response;
  }

  async execute() {
    try {
      const { userId } = this.request;

      const { id } = this.request.params;

      if (!id) {
        return this.error("ID is required.");
      }

      const membership = await MembershipsModel.findOne({
        _id: id,
        user: userId
      }).populate("plan gym");

      const activity = await ActivityModel.find({
        user: userId,
        membership: id
      }).sort({ createdAt: -1 });

      return this.success({ data: { membership, activity } });
    } catch (error) {
      logger.error("GetMembershipUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
