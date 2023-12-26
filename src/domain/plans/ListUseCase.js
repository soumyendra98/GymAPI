const moment = require("moment-timezone");
const PlansModel = require("../../models/Plans");
const MembershipsModel = require("../../models/Memberships");
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

      const plans = await PlansModel.find({ gym: gymId, location });

      const previousMonthStart = moment()
        .subtract(1, "month")
        .startOf("month");

      const previousMonthEnd = moment()
        .subtract(1, "month")
        .endOf("month");

      const currentMonthStart = moment().startOf("month");

      const currentMonthEnd = moment().endOf("month");

      const data = [];

      for (let i = 0; i < plans.length; i++) {
        const plan = plans[i];

        const activeMemberships = await MembershipsModel.find({
          plan: plan._id
        }).countDocuments();

        const previousMonthNewMemberships = await MembershipsModel.find({
          plan: plan._id,
          createdAt: {
            $gte: previousMonthStart,
            $lte: previousMonthEnd
          }
        }).countDocuments();

        const currentMonthNewMemberships = await MembershipsModel.find({
          plan: plan._id,
          createdAt: {
            $gte: currentMonthStart,
            $lte: currentMonthEnd
          }
        }).countDocuments();

        data.push({
          ...plan.toObject(),
          stats: {
            activeMembers: activeMemberships,
            previousMonthNewMemberships,
            currentMonthNewMemberships
          }
        });
      }

      return this.success({ data });
    } catch (error) {
      logger.error("ListUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
