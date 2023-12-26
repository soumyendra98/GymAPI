const mongoose = require("mongoose");
const { MONGO_URL } = require("../../utils/config");
const logger = require("../../utils/logger");

class DatabaseService {
  constructor() {
    mongoose.set("strictQuery", true);
    mongoose
      .connect(MONGO_URL)
      .then(() => logger.info("MongoDB Connected!!!"))
      .catch(err => logger.error("MongoDB Connection Failed -> error ", err));
  }

  static getInstance() {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }

    return DatabaseService.instance;
  }
}

module.exports = DatabaseService.getInstance();
