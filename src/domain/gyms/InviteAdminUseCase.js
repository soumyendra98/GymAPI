const crypto = require("crypto");
const UsersModel = require("../../models/Users");
const BaseUseCase = require("../BaseUseCase");
const { sendEmail } = require("../../services/sendgrid");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../constants/App");
const { UserRoles, UserStatus } = require("../../constants/Users");
const { APP_HOST_URL } = require("../../utils/config");
const logger = require("../../utils/logger");

module.exports = class InviteAdminUseCase extends BaseUseCase {
  constructor(request, response) {
    super(request, response);

    this.request = request;
    this.response = response;
  }

  async execute() {
    try {
      const { user } = this.request;

      const { email } = this.request.body;

      if (!email) {
        return this.error("Email is required.");
      }

      const admin = await UsersModel.findOne({
        email,
        status: UserStatus.ACTIVE
      });

      if (admin) {
        return this.error("Admin with email already exists.");
      }

      await new UsersModel({
        firstName: "",
        lastName: "",
        email,
        role: UserRoles.ADMIN,
        status: UserStatus.INVITED,
        avatar: crypto
          .createHash("md5")
          .update(email)
          .digest("hex"),
        gym: user.gym._id
      }).save();

      const link = `${APP_HOST_URL}/signup?email=${email}`;

      console.log(link);

      // const res = await sendEmail({
      //   to: email,
      //   subject: `Invitation from ${user.gym.name}`,
      //   text: `Hey there, ${user.firstName} has invited you to join their Health Club account, click on the link below to continue with registration.\n\n${link}`
      // });

      // console.log("email res : ", res);

      return this.success({
        message: "Invited successfully!"
      });
    } catch (error) {
      logger.error("InviteAdminUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
