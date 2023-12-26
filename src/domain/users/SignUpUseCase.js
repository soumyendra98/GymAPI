const crypto = require("crypto");
const UsersModel = require("../../models/Users");
const BaseUseCase = require("../BaseUseCase");
const UserFactory = require("../factory/UserFactory");
const { UserStatus, UserRoles } = require("../../constants/Users");
const { createSalt, hashPassword, encodeJWT } = require("../../utils/jwt");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../constants/App");
const logger = require("../../utils/logger");

module.exports = class SignUpUseCase extends BaseUseCase {
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
        memberSignup = false
      } = this.request.body;

      if (!firstName) {
        return this.error("First name is required.");
      }

      if (!lastName) {
        return this.error("Last name is required.");
      }

      if (!email) {
        return this.error("Email is required.");
      }

      if (!password) {
        return this.error("Password is required.");
      }

      if (!confirmPassword) {
        return this.error("Confirm Password is required.");
      }

      if (memberSignup) {
        const newUser = await new UsersModel({
          firstName,
          lastName,
          email,
          role: UserRoles.MEMBER,
          status: UserStatus.ACTIVE,
          password: hashPassword(password, createSalt()),
          avatar: crypto
            .createHash("md5")
            .update(email)
            .digest("hex")
        }).save();

        return this.success({
          data: {
            user: newUser,
            token: encodeJWT({ userId: newUser._id })
          }
        });
      }

      const user = await UsersModel.findOne({ email });

      if (!user) {
        return this.error("User has not been invited.");
      }

      const hashedPassword = hashPassword(password, createSalt());

      const newUser = await UsersModel.findOneAndUpdate(
        {
          email
        },
        {
          firstName,
          lastName,
          password: hashedPassword,
          status: UserStatus.ACTIVE
        }
      );

      return this.success({
        data: {
          user: newUser,
          token: encodeJWT({ userId: newUser._id })
        }
      });
    } catch (error) {
      logger.error("SignUpUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
