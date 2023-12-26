const { nanoid } = require("nanoid");
const GymModel = require("../../models/Gym");
const BaseUseCase = require("../BaseUseCase");
const { uploadImage } = require("../../services/aws");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../constants/App");
const logger = require("../../utils/logger");

module.exports = class UpdateProfileUseCase extends BaseUseCase {
  constructor(request, response) {
    super(request, response);

    this.request = request;
    this.response = response;
  }

  async execute() {
    try {
      const { user } = this.request;

      const {
        addressLine1,
        addressLine2,
        city,
        state,
        country,
        zipcode,
        name,
        description,
        businessBannerBase64,
        businessBannerContentType,
        businessLogoBase64,
        businessLogoContentType
      } = this.request.body;

      const payload = {
        name,
        description,
        addressLine1,
        addressLine2,
        city,
        state,
        country,
        zipcode
      };

      if (businessBannerBase64 && businessBannerContentType) {
        const uploadedFile = await uploadImage({
          key: nanoid(),
          body: Buffer.from(
            businessBannerBase64.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          ),
          contentType: businessBannerContentType
        });

        if (uploadedFile && uploadedFile.Location) {
          payload.banner = uploadedFile.Location;
        }
      }

      if (businessLogoBase64 && businessLogoContentType) {
        const uploadedFile = await uploadImage({
          key: nanoid(),
          body: Buffer.from(
            businessLogoBase64.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          ),
          contentType: businessLogoContentType
        });

        if (uploadedFile && uploadedFile.Location) {
          payload.logo = uploadedFile.Location;
        }
      }

      await GymModel.findOneAndUpdate({ _id: user.gym._id }, payload);

      return this.success({
        message: "Profile updated successfully!"
      });
    } catch (error) {
      logger.error("UpdateProfileUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
