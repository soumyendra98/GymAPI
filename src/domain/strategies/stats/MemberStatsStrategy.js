const MembershipsModel = require("../../../models/Memberships");
const BaseStatsStrategy = require("./BaseStatsStrategy");

class MemberStatsStrategy extends BaseStatsStrategy {
  constructor(user, location) {
    super();

    this.user = user;
    this.location = location;
  }

  async execute() {
    const { gym, _id: member } = this.user.member;

    const totalMemberships = await MembershipsModel.find({
      member,
      location: this.location,
      gym
    }).countDocuments();

    const currentMonthMemberships = await MembershipsModel.find({
      member,
      location: this.location,
      gym,
      createdAt: {
        $gte: this.startOfMonth,
        $lte: this.endOfMonth
      }
    }).populate("plan");

    const previousMonthMemberships = await MembershipsModel.find({
      member,
      location: this.location,
      gym,
      createdAt: {
        $gte: this.startOfPreviousMonth,
        $lte: this.endOfPreviousMonth
      }
    }).populate("plan");

    let currentMonthSpent = 0;

    let previousMonthSpent = 0;

    currentMonthMemberships.forEach(elem => {
      currentMonthSpent += elem.plan.price;
    });

    previousMonthMemberships.forEach(elem => {
      previousMonthSpent += elem.plan.price;
    });

    return { previousMonthSpent, currentMonthSpent, totalMemberships };
  }
}

module.exports = MemberStatsStrategy;
