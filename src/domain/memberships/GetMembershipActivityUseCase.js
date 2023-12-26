const ActivityModel = require("../../models/Activity");
const BaseUseCase = require("../BaseUseCase");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../constants/App");
const logger = require("../../utils/logger");

module.exports = class GetMembershipActivityUseCase extends BaseUseCase {
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

      const activity = await ActivityModel.findOne({
        _id: id,
        user: userId
      });

      return this.success({ data: activity });
    } catch (error) {
      logger.error("GetMembershipActivityUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
