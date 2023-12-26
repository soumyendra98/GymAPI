const GymModel = require("../../models/Gym");
const PlansModel = require("../../models/Plans");
const LocationsModel = require("../../models/Locations");
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
      const { gymId, locationId } = this.request.query;

      const gyms = await GymModel.find({});

      const data = [];

      for (let i = 0; i < gyms.length; i++) {
        const gym = gyms[i];

        const plansFilter = { gym: gym._id };

        if (locationId && gymId === gym._id.toString()) {
          plansFilter.location = locationId;
        }

        const plans = await PlansModel.find(plansFilter);

        const locations = await LocationsModel.find({ gym: gym._id });

        data.push({ ...gym.toObject(), plans, locations });
      }

      return this.success({ data });
    } catch (error) {
      logger.error("ListUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
