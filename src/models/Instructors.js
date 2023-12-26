const mongoose = require("mongoose");

const collection = "Instructors";

const { Schema } = mongoose;

const InstructorsSchema = new Schema(
  {
    user: {
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

const Instructors = mongoose.model(collection, InstructorsSchema);

module.exports = Instructors;
