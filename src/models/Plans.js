const mongoose = require("mongoose");

const collection = "Plans";

const { PlanType } = require("../constants/Plans");

const PlansSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    description: {
      type: String
    },
    price: {
      type: Number
    },
    type: {
      type: String,
      enum: Object.values(PlanType)
    },
    schedule: {
      type: Object
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Locations",
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

const Plans = mongoose.model(collection, PlansSchema);

module.exports = Plans;
