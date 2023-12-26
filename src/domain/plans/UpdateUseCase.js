const PlansModel = require("../../models/Plans");
const BaseUseCase = require("../BaseUseCase");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../constants/App");
const logger = require("../../utils/logger");

module.exports = class UpdateUseCase extends BaseUseCase {
  constructor(request, response) {
    super(request, response);

    this.request = request;
    this.response = response;
  }

  async execute() {
    try {
      const { user } = this.request;

      const {
        id: planId,
        name,
        description,
        price,
        type,
        schedule,
        instructor,
        location
      } = this.request.body;

      if (!planId) {
        return this.error("Plan ID is required.");
      }

      if (!name) {
        return this.error("Name is required.");
      }

      if (!description) {
        return this.error("Description is required.");
      }

      if (!price) {
        return this.error("Price is required.");
      }

      if (!type) {
        return this.error("Type is required.");
      }

      if (!schedule) {
        return this.error("Schedule is required.");
      }

      if (!instructor) {
        return this.error("Instructor ID is required.");
      }

      if (!location) {
        return this.error("Location ID is required.");
      }

      const plan = await PlansModel.findOneAndUpdate(
        {
          _id: planId,
          gym: user.gym._id
        },
        {
          name,
          description,
          price,
          type,
          schedule,
          instructor,
          location
        }
      );

      return this.success({
        data: plan,
        message: "Plan updated successfully!"
      });
    } catch (error) {
      logger.error("UpdateUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
