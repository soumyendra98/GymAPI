const crypto = require("crypto");
const UsersModel = require("../../models/Users");
const BaseUseCase = require("../BaseUseCase");
const UserFactory = require("../factory/UserFactory");
const { sendEmail } = require("../../services/sendgrid");
const { INTERNAL_SERVER_ERROR_MESSAGE } = require("../../constants/App");
const { UserRoles, UserStatus } = require("../../constants/Users");
const { APP_HOST_URL } = require("../../utils/config");
const logger = require("../../utils/logger");

module.exports = class InviteUseCase extends BaseUseCase {
  constructor(request, response) {
    super(request, response);

    this.request = request;
    this.response = response;
  }

  async execute() {
    try {
      const { user } = this.request;

      const { members, location } = this.request.body;

      if (!members || !members.length) {
        return this.error("Atleast one member is required.");
      }

      if (!location) {
        return this.error("Location is required.");
      }

      for (let i = 0; i < members.length; i++) {
        const member = members[i];

        if (member && member.firstName && member.email) {
          const memberDetails = await UsersModel.findOne({
            email: member.email
          });

          if (memberDetails && memberDetails.status === UserStatus.ACTIVE) {
            continue; // eslint-disable-line
          }

          await UserFactory.create(
            UserRoles.MEMBER,
            {
              firstName: member.firstName,
              lastName: member.lastName || "",
              email: member.email,
              role: UserRoles.MEMBER,
              status: UserStatus.INVITED,
              avatar: crypto
                .createHash("md5")
                .update(member.email)
                .digest("hex")
            },
            location,
            user.gym._id
          );

          const link = `${APP_HOST_URL}/signup?firstName=${member.firstName}&lastName=${member.lastName}&email=${member.email}`;

          console.log(link);

          // const res = await sendEmail({
          //   to: member.email,
          //   subject: "Invitation from Health Club",
          //   text: `Hey there, ${user.firstName} has invited you to join their Health Club account, click on the link below to continue with registration.\n\n${link}`
          // });

          // console.log("email res : ", res);
        }
      }

      return this.success({
        message: `${
          members.length === 1 ? "Member" : "Members"
        } invited successfully.`
      });
    } catch (error) {
      logger.error("InviteUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
