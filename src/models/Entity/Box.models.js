const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { StatusBoxType } = require("../Enum/StatusBoxType.enum");

const BoxSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: false,
      default: uuidv4,
    },
    order: {
      type: Number,
      required: false,
    },
    xCoordinate: {
      type: Number,
      required: false,
    },
    yCoordinate: {
      type: Number,
      required: false,
    },
    width: {
      type: Number,
      required: false,
    },
    height: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      enum: StatusBoxType,
      required: false,
      default: StatusBoxType.UNVERIFIED,
    },
  },
  { versionKey: false }
);

const Box = mongoose.model("Box", BoxSchema);

module.exports = {
  Box,
  BoxSchema,
};
