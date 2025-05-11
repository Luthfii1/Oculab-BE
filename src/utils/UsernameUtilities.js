const { User } = require("../models/Entity/User.models");

async function generateUniqueUsername(fullName) {
  const nameParts = fullName.trim().toLowerCase().split(/\s+/);
  const first = nameParts[0] || "";
  const last = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
  const base = `${first}${last}`;

  let username = base;
  let counter = 1;

  while (await User.findOne({ username })) {
    username = `${base}${counter}`;
    counter++;
  }

  return username;
}

module.exports = { generateUniqueUsername };
