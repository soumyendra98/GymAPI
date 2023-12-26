const LocationsModel = require("../../models/Locations");
const BaseUseCase = require("../BaseUseCase");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../constants/App");
const logger = require("../../utils/logger");
const { UserRoles } = require("../../constants/Users");

module.exports = class GetLocationsUseCase extends BaseUseCase {
  constructor(request, response) {
    super(request, response);

    this.request = request;
    this.response = response;
  }

  async execute() {
    try {
      const { user } = this.request;

      let gymId = "";

      if (user.role === UserRoles.ADMIN) {
        gymId = user.gym._id;
      }

      if (user.role === UserRoles.MEMBER) {
        gymId = user.member.gym._id;
      }

      if (user.role === UserRoles.INSTRUCTOR) {
        gymId = user.instructor.gym._id;
      }

      const locations = await LocationsModel.find({ gym: gymId });

      return this.success({ data: locations });
    } catch (error) {
      logger.error("GetLocationsUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
