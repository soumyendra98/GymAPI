const MembersModel = require("../../models/Members");

class MemberFactory {
  // eslint-disable-next-line
  async create(payload) {
    return await new MembersModel(payload).save();
  }
}

module.exports = new MemberFactory();
