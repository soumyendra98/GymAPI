const MembersModel = require("../../../models/Members");
const InstructorsModel = require("../../../models/Instructors");
const PlansModel = require("../../../models/Plans");
const MembershipsModel = require("../../../models/Memberships");
const BaseStatsStrategy = require("./BaseStatsStrategy");

class AdminStatsStrategy extends BaseStatsStrategy {
  constructor(user, location) {
    super();

    this.user = user;
    this.location = location;
  }

  async execute() {
    const currentMonthMemberships = await MembershipsModel.find({
      location: this.location,
      gym: this.user.gym._id,
      createdAt: {
        $gte: this.startOfMonth,
        $lte: this.endOfMonth
      }
    }).populate("plan");

    const previousMonthMemberships = await MembershipsModel.find({
      location: this.location,
      gym: this.user.gym._id,
      createdAt: {
        $gte: this.startOfPreviousMonth,
        $lte: this.endOfPreviousMonth
      }
    }).populate("plan");

    const totalMembers = await MembersModel.find({
      location: this.location,
      gym: this.user.gym._id
    }).countDocuments();

    const totalInstructors = await InstructorsModel.find({
      location: this.location,
      gym: this.user.gym._id
    }).countDocuments();

    const totalClassesScheduled = await PlansModel.find({
      location: this.location,
      gym: this.user.gym._id
    }).countDocuments();

    let currentMonthRevenue = 0;

    currentMonthMemberships.forEach(elem => {
      currentMonthRevenue += Number(elem.plan.price);
    });

    let previousMonthRevenue = 0;

    previousMonthMemberships.forEach(elem => {
      previousMonthRevenue += Number(elem.plan.price);
    });

    return {
      previousMonthRevenue,
      currentMonthRevenue,
      newMemberships: currentMonthMemberships.length,
      totalMembers,
      totalInstructors,
      totalClassesScheduled
    };
  }
}

module.exports = AdminStatsStrategy;
