const jwt = require('jsonwebtoken');

const accessToken = process.env.ACCESS_TOKEN;
const refreshToken = process.env.REFRESH_TOKEN;

function authenticateToken(req, res, next) {
    const authenticationHeader = req.headers['authorization'];
    const token = authenticationHeader && authenticationHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, accessToken, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Failed to authenticate token' });

        req.body.tokenUserId = decoded.userId;
        req.body.tokenRole = decoded.role;
        next();
    });
}

function authenticateRefreshToken(req, res, next) {
    const authenticationHeader = req.headers['authorization'];
    const token = authenticationHeader && authenticationHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, refreshToken, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Failed to authenticate token' });

        req.body.tokenUserId = decoded.userId;
        req.body.tokenRole = decoded.role;
        next();
    });
}

module.exports = {
    authenticateToken,
    authenticateRefreshToken
};