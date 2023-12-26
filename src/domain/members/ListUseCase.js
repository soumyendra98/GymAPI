const MembersModel = require("../../models/Members");
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

      const { location } = this.request.query;

      const members = await MembersModel.find({
        location,
        gym: user.gym._id
      }).populate("user");

      const data = [];

      for (let i = 0; i < members.length; i++) {
        const member = members[i];

        const memberships = await MembershipsModel.find({
          member: member._id
        }).populate("plan");

        let totalSpent = 0;

        memberships.forEach(elem => {
          totalSpent += elem.plan.price;
        });

        data.push({
          ...member.toObject(),
          totalSpent,
          totalMemberships: memberships.length
        });
      }

      return this.success({ data });
    } catch (error) {
      logger.error("ListUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
