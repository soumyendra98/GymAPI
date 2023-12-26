const mongoose = require("mongoose");

const collection = "Memberships";

const MembershipsSchema = new mongoose.Schema(
  {
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plans",
      default: null
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Members",
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

const Memberships = mongoose.model(collection, MembershipsSchema);

module.exports = Memberships;
