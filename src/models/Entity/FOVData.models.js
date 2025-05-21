const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { FOVType } = require("../Enum/FOVType.enum");

const BoundingBoxDataSchema = new mongoose.Schema(
  {
    boxes: {
      type: [String],
      required: false,
    },
    frameWidth: {
      type: Number,
      required: false,
      default: 600,
    },
    frameHeight: {
      type: Number,
      required: false,
      default: 600,
    },
  },
  { _id: false } // No need for an ID
);

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
    imageOriginal: {
      type: String,
      required: false,
    },
    imageMLAnalyzed: {
      type: String,
      required: false,
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
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    boundingBoxData: {
      type: BoundingBoxDataSchema,
      required: false,
    },
  },
  { versionKey: false } // Disables the __v field for versioning
);

const FOVData = mongoose.model("FOVData", FOVDataSchema);

module.exports = {
  FOVData,
  FOVDataSchema,
};
