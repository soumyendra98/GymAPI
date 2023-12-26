const PlansModel = require("../../models/Plans");
const BaseUseCase = require("../BaseUseCase");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../constants/App");
const logger = require("../../utils/logger");
const { UserRoles } = require("../../constants/Users");

module.exports = class GetPlanUseCase extends BaseUseCase {
  constructor(request, response) {
    super(request, response);

    this.request = request;
    this.response = response;
  }

  async execute() {
    try {
      const { user } = this.request;

      const { id: planId } = this.request.params;

      if (!planId) {
        return this.error("Plan ID is required.");
      }

      let gymId = "";

      if (user.role === UserRoles.ADMIN) {
        gymId = user.gym._id;
      }

      if (user.role === UserRoles.INSTRUCTOR) {
        gymId = user.instructor.gym;
      }

      const plan = await PlansModel.findOne({
        _id: planId,
        gym: gymId
      });

      return this.success({ data: plan });
    } catch (error) {
      logger.error("GetPlanUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
