const jwt = require('jsonwebtoken');

const accessToken = process.env.ACCESS_TOKEN;
const refreshToken = process.env.REFRESH_TOKEN;

function generateAccessToken(user) {
    const payload = { userId: user._id, role: user.role };
    return jwt.sign(payload, accessToken, { expiresIn: "15m" });
}

function generateRefreshToken(user) {
    const payload = { userId: user._id, role: user.role };
    return jwt.sign(payload, refreshToken);
}

module.exports = {
    generateAccessToken,
    generateRefreshToken
};