const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ContactSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
      default: uuidv4,
    },
    whatsappNumber: {
      type: String,
      required: true,
    },
  },
  { versionKey: false } // Disables the __v field for versioning
);

const Contact = mongoose.model("Contact", ContactSchema);

module.exports = {
  Contact,
  ContactSchema,
};
