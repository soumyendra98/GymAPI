const moment = require("moment-timezone");

class BaseStatsStrategy {
  constructor() {
    this.startOfPreviousMonth = moment()
      .subtract(1, "month")
      .startOf("month");

    this.endOfPreviousMonth = moment()
      .subtract(1, "month")
      .endOf("month");

    this.startOfMonth = moment().startOf("month");

    this.endOfMonth = moment().endOf("month");
  }
}

module.exports = BaseStatsStrategy;
