const InstructorsModel = require("../../models/Instructors");
const PlansModel = require("../../models/Plans");
const BaseUseCase = require("../BaseUseCase");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../constants/App");
const logger = require("../../utils/logger");
const { UserRoles } = require("../../constants/Users");

module.exports = class ListUseCase extends BaseUseCase {
  constructor(request, response) {
    super(request, response);

    this.request = request;
    this.response = response;
  }

  async execute() {
    try {
      const { user } = this.request;

      const { location } = this.request.query;

      if (!location) {
        return this.error("Location is required.");
      }

      let gymId = "";

      if (user.role === UserRoles.ADMIN) {
        gymId = user.gym._id;
      }

      if (user.role === UserRoles.INSTRUCTOR) {
        gymId = user.instructor.gym;
      }

      const instructors = await InstructorsModel.find({
        location,
        gym: gymId
      }).populate("user");

      const data = [];

      for (let i = 0; i < instructors.length; i++) {
        const instructor = instructors[i];

        const plans = await PlansModel.find({
          instructor: instructor._id
        });

        let totalEarned = 0;

        plans.forEach(elem => {
          totalEarned += elem.price;
        });

        data.push({
          ...instructor.toObject(),
          totalEarned,
          totalClasses: plans.length
        });
      }

      return this.success({ data });
    } catch (error) {
      logger.error("ListUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
