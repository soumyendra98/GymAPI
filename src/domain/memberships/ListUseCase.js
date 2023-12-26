const MembershipsModel = require("../../models/Memberships");
const BaseUseCase = require("../BaseUseCase");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../constants/App");
const logger = require("../../utils/logger");

module.exports = class ListUseCase extends BaseUseCase {
  constructor(request, response) {
    super(request, response);

    this.request = request;
    this.response = response;
  }

  async execute() {
    try {
      const { user } = this.request;

      const memberships = await MembershipsModel.find({
        member: user.member._id
      }).populate("plan gym");

      return this.success({ data: memberships });
    } catch (error) {
      logger.error("ListUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
