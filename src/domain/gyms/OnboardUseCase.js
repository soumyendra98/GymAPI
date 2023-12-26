const crypto = require("crypto");
const GymModel = require("../../models/Gym");
const UsersModel = require("../../models/Users");
const BaseUseCase = require("../BaseUseCase");
const UserFactory = require("../factory/UserFactory");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../constants/App");
const { UserRoles, UserStatus } = require("../../constants/Users");
const { hashPassword, createSalt, encodeJWT } = require("../../utils/jwt");
const logger = require("../../utils/logger");

module.exports = class OnboardUseCase extends BaseUseCase {
  constructor(request, response) {
    super(request, response);

    this.request = request;
    this.response = response;
  }

  async execute() {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        gymName
      } = this.request.body;

      if (!firstName) {
        return this.error("First Name is required.");
      }

      if (!email) {
        return this.error("Last Name is required.");
      }

      if (!password) {
        return this.error("Password required.");
      }

      if (!confirmPassword) {
        return this.error("Confirm Password is required.");
      }

      if (password !== confirmPassword) {
        return this.error("Passwords don't match.");
      }

      if (!gymName) {
        return this.error("Gym Name is required.");
      }

      const user = await UsersModel.findOne({ email });

      if (user) {
        return this.error("User with email already exists.");
      }

      const gym = await new GymModel({
        name: gymName
      }).save();

      const hashedPassword = hashPassword(password, createSalt());

      const newUser = await UserFactory.create(
        UserRoles.ADMIN,
        {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role: UserRoles.ADMIN,
          status: UserStatus.ACTIVE,
          avatar: crypto
            .createHash("md5")
            .update(email)
            .digest("hex")
        },
        null,
        gym._id
      );

      return this.success({
        data: {
          user: newUser,
          gym,
          token: encodeJWT({ userId: newUser._id })
        }
      });
    } catch (error) {
      logger.error("OnboardUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
