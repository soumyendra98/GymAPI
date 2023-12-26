const { UserRoles } = require("../../constants/Users");
const MemberFactory = require("./MemberFactory");
const InstructorFactory = require("./InstructorFactory");
const UsersModel = require("../../models/Users");

class UserFactory {
  // eslint-disable-next-line
  async create(role, payload, location = null, gym = null) {
    const user = await new UsersModel(payload).save();

    if (role === UserRoles.ADMIN) {
      user.gym = gym;
      await user.save();
    }

    if (role === UserRoles.MEMBER) {
      const member = await MemberFactory.create({
        user: user._id,
        location,
        gym
      });

      user.member = member._id;
      await user.save();
    }

    if (role === UserRoles.INSTRUCTOR) {
      const instructor = await InstructorFactory.create({
        user: user._id,
        location,
        gym
      });

      user.instructor = instructor._id;
      await user.save();
    }

    return user;
  }
}

module.exports = new UserFactory();
