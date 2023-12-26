const LocationsModel = require("../../models/Locations");
const BaseUseCase = require("../BaseUseCase");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../constants/App");
const logger = require("../../utils/logger");

module.exports = class UpdateLocationsUseCase extends BaseUseCase {
  constructor(request, response) {
    super(request, response);

    this.request = request;
    this.response = response;
  }

  async execute() {
    try {
      const {
        id: locationId,
        location: { addressLine1, addressLine2, city, state, country, zipcode }
      } = this.request.body;

      if (!locationId) {
        return this.error("ID is required.");
      }

      if (!addressLine1) {
        return this.error("Address Line 1 is required.");
      }

      if (!addressLine2) {
        return this.error("Address Line 2 is required.");
      }

      if (!city) {
        return this.error("City is required.");
      }

      if (!state) {
        return this.error("State is required.");
      }

      if (!country) {
        return this.error("Country is required.");
      }

      if (!zipcode) {
        return this.error("Zipcode is required.");
      }

      await LocationsModel.findOneAndUpdate(
        { _id: locationId },
        {
          addressLine1,
          addressLine2,
          city,
          state,
          country,
          zipcode
        }
      );

      return this.success({
        message: "Location updated successfully!"
      });
    } catch (error) {
      logger.error("UpdateLocationsUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
