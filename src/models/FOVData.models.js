const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const FOVType = Object.freeze({
  BTA0: "0 BTA",
  BTA1TO9: "1-9 BTA",
  BTAABOVE9: "≥ 10 BTA",
});

const FOVDataSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: uuidv4,
  },
  image: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: Object.values(FOVType),
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  comment: [
    {
      type: String,
      required: false,
    },
  ],
  systemCount: {
    type: Number,
    required: false,
  },
  confidenceLevel: {
    type: mongoose.Decimal128,
    required: false,
  },
});

const FOVData = mongoose.model("FOVData", FOVDataSchema);

module.exports = {
  FOVData,
  FOVDataSchema,
};
