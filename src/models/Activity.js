const mongoose = require("mongoose");

const collection = "Activity";

const { ActivityType } = require("../constants/Activity");

const ActivitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: Object.values(ActivityType)
    },
    equipmentType: {
      type: String
    },
    description: {
      type: String
    },
    duration: {
      type: Number
    },
    membership: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Memberships",
      default: null
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Locations",
      default: null
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null
    },
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      default: null
    }
  },
  { timestamps: true, collection }
);

const Activity = mongoose.model(collection, ActivitySchema);

module.exports = Activity;
