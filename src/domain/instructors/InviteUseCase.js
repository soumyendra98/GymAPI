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

      const { instructors, location } = this.request.body;

      if (!instructors || !instructors.length) {
        return this.error("Atleast one instructor is required.");
      }

      if (!location) {
        return this.error("Location is required.");
      }

      for (let i = 0; i < instructors.length; i++) {
        const instructor = instructors[i];

        if (instructor && instructor.firstName && instructor.email) {
          const instructorDetails = await UsersModel.findOne({
            email: instructor.email
          });

          if (
            instructorDetails &&
            instructorDetails.status === UserStatus.ACTIVE
          ) {
            continue; // eslint-disable-line
          }

          await UserFactory.create(
            UserRoles.INSTRUCTOR,
            {
              firstName: instructor.firstName,
              lastName: instructor.lastName || "",
              email: instructor.email,
              role: UserRoles.INSTRUCTOR,
              status: UserStatus.INVITED,
              avatar: crypto
                .createHash("md5")
                .update(instructor.email)
                .digest("hex")
            },
            location,
            user.gym._id
          );

          const link = `${APP_HOST_URL}/signup?firstName=${instructor.firstName}&lastName=${instructor.lastName}&email=${instructor.email}`;

          // await sendEmail({
          //   to: instructor.email,
          //   subject: "Invitation from Health Club",
          //   text: `Hey there, ${user.firstName} has invited you to join their Health Club account, click on the link below to continue with registration.\n\n${link}`
          // });
          console.log(link);
        }
      }

      return this.success({
        message: `${
          instructors.length === 1 ? "Instructor" : "Instructors"
        } invited successfully.`
      });
    } catch (error) {
      logger.error("InviteUseCase -> error : ", error);
      return this.error(INTERNAL_SERVER_ERROR_MESSAGE);
    }
  }
};
