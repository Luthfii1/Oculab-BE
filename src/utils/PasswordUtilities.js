const crypto = require("crypto");
const globalSalt = process.env.GLOBAL_SALT;

function hashPassword(password) {
  return crypto.createHmac("sha256", globalSalt).update(password).digest("hex");
}

function generateRandomPassword(length = 12) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
  let password = "";
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    password += chars[bytes[i] % chars.length];
  }
  return password;
}

module.exports = {
  hashPassword,
  generateRandomPassword,
};
