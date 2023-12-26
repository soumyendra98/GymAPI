const mongoose = require("mongoose");

const collection = "Gym";

const GymSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    description: {
      type: String
    },
    logo: {
      type: String
    },
    banner: {
      type: String
    },
    addressLine1: {
      type: String
    },
    addressLine2: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    country: {
      type: String
    },
    zipcode: {
      type: String
    }
  },
  { timestamps: true, collection }
);

const Gym = mongoose.model(collection, GymSchema);

module.exports = Gym;
