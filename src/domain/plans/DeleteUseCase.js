const PlansModel = require("../../models/Plans");
const BaseUseCase = require("../BaseUseCase");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../constants/App");
const logger = require("../../utils/logger");

module.exports = class DeleteUseCase extends BaseUseCase {
  constructor(request, response) {
    super(request, response);

    this.request = request;
    this.response = response;
  }

  async execute() {
    try {
      const { planId } = this.request.query;

      if (!planId) {
        return this.error("Plan ID is required.");
      }

      const plan = await PlansModel.findOneAndRemove({
        _id: planId
      });

      return this.success({
        data: plan,
        message: "Plan deleted successfully!"
      });
    } catch (error) {
      logger.error("DeleteUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
