const mongoose = require("mongoose");

const collection = "Users";

const { UserRoles, UserStatus } = require("../constants/Users");

const { Schema } = mongoose;

const UsersSchema = new Schema(
  {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
      type: String,
      index: true
    },
    password: {
      type: String
    },
    avatar: {
      type: String
    },
    role: {
      type: String,
      enum: Object.values(UserRoles)
    },
    status: {
      type: String,
      enum: Object.values(UserStatus)
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Members",
      default: null
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructors",
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

const Users = mongoose.model(collection, UsersSchema);

module.exports = Users;
