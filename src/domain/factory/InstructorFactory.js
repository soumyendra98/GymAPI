const InstructorsModel = require("../../models/Instructors");

class InstructorFactory {
  // eslint-disable-next-line
  async create(payload) {
    return await new InstructorsModel(payload).save();
  }
}

module.exports = new InstructorFactory();
