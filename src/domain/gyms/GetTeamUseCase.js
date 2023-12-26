const UsersModel = require("../../models/Users");
const BaseUseCase = require("../BaseUseCase");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../constants/App");
const logger = require("../../utils/logger");
const { UserRoles } = require("../../constants/Users");

module.exports = class GetTeamUseCase extends BaseUseCase {
  constructor(request, response) {
    super(request, response);

    this.request = request;
    this.response = response;
  }

  async execute() {
    try {
      const { user } = this.request;

      const adminUsers = await UsersModel.find({
        gym: user.gym._id,
        role: UserRoles.ADMIN
      });

      return this.success({ data: adminUsers });
    } catch (error) {
      logger.error("GetTeamUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
