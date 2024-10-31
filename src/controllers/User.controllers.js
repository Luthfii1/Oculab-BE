const userServices = require("../services/User.service");

exports.login = async function (req, res) {
    try {
        const result = await userServices.login(req.body);
        res.status(200).json(result);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

exports.register = async function (req, res) {
    try {
        const result = await userServices.register(req.body);
        res.status(200).json(result);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

exports.refreshToken = async function (req, res) {
    try {
        const result = await userServices.refreshToken(req.body, req.params);
        res.status(200).json(result);       
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

exports.getAllUsers = async function(req, res) {
    try {
        const result = await userServices.getAllUsers();
        res.status(200).json(result);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};

exports.getUserById = async function(req, res) {
    try {
        const result = await userServices.getUserById(req.params);
        res.status(200).json(result);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
};