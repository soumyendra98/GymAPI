const PlansModel = require("../../../models/Plans");
const BaseStatsStrategy = require("./BaseStatsStrategy");

class InstructorStatsStrategy extends BaseStatsStrategy {
  constructor(user, location) {
    super();

    this.user = user;
    this.location = location;
  }

  async execute() {
    const { gym, _id: instructor } = this.user.instructor;

    const totalClasses = await PlansModel.find({
      instructor,
      location: this.location,
      gym
    }).countDocuments();

    const previousMonthPlans = await PlansModel.find({
      instructor,
      location: this.location,
      gym,
      createdAt: {
        $gte: this.startOfPreviousMonth,
        $lte: this.endOfPreviousMonth
      }
    });

    const currentMonthPlans = await PlansModel.find({
      instructor,
      location: this.location,
      gym,
      createdAt: {
        $gte: this.startOfMonth,
        $lte: this.endOfMonth
      }
    });

    let currentMonthEarned = 0;

    let previousMonthEarned = 0;

    currentMonthPlans.forEach(plan => {
      currentMonthEarned += plan.price;
    });

    previousMonthPlans.forEach(plan => {
      previousMonthEarned += plan.price;
    });

    return { previousMonthEarned, currentMonthEarned, totalClasses };
  }
}

module.exports = InstructorStatsStrategy;
