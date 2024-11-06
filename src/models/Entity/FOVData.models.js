const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { FOVType } = require("../Enum/FOVType.enum");

const FOVDataSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      default: uuidv4,
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
      type: Number,
      required: true,
    },
  },
  { versionKey: false } // Disables the __v field for versioning
);

const FOVData = mongoose.model("FOVData", FOVDataSchema);

module.exports = {
  FOVData,
  FOVDataSchema,
};
