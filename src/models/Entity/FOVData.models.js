const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { FOVType } = require("../Enum/FOVType.enum");

const FOVDataSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: FOVType,
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
    required: true,
  },
  confidenceLevel: {
    type: mongoose.Decimal128,
    required: true,
  },
});

const FOVData = mongoose.model("FOVData", FOVDataSchema);

module.exports = {
  FOVData,
  FOVDataSchema,
};