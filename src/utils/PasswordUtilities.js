const crypto = require("crypto");
const globalSalt = process.env.GLOBAL_SALT;

function hashPassword(password) {
  return crypto.createHmac("sha256", globalSalt).update(password).digest("hex");
}

module.exports = {
  hashPassword,
};
