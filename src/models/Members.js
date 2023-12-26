const mongoose = require("mongoose");

const collection = "Members";

const { Schema } = mongoose;

const MembersSchema = new Schema(
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

const Members = mongoose.model(collection, MembersSchema);

module.exports = Members;
