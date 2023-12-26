const UsersModel = require("../../models/Users");
const BaseUseCase = require("../BaseUseCase");
const { hashPassword, encodeJWT } = require("../../utils/jwt");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../constants/App");
const logger = require("../../utils/logger");

module.exports = class SignInUseCase extends BaseUseCase {
  constructor(request, response) {
    super(request, response);

    this.request = request;
    this.response = response;
  }

  async execute() {
    try {
      const { email, password } = this.request.body;

      if (!email) {
        return this.error("Email is required.");
      }

      if (!password) {
        return this.error("Password is required.");
      }

      const user = await UsersModel.findOne({ email });

      if (!user) {
        return this.error(
          "User with email does not exist. Please check your credentials and try again."
        );
      }

      const salt = user.password.split("$")[0];

      const hashedPassword = hashPassword(password, salt);

      if (hashedPassword !== user.password) {
        return this.response.status(403).json({
          success: false,
          message: "Incorrect password. Please try again."
        });
      }

      const token = encodeJWT({ userId: user._id });

      return this.success({ data: { user, token } });
    } catch (error) {
      logger.error("SignInUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
