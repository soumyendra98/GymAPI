const mongoose = require("mongoose");

const collection = "Locations";

const LocationsSchema = new mongoose.Schema(
  {
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
    },
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      default: null
    }
  },
  { timestamps: true, collection }
);

const Locations = mongoose.model(collection, LocationsSchema);

module.exports = Locations;
