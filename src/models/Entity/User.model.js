const mongoose = require("mongoose");
const { RolesType } = require("../Enum/RolesType.enum");

const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: RolesType,
    required: true,
  },
  token: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = {
  User,
  UserSchema,
};
