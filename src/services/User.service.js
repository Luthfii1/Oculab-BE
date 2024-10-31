const mongoose = require("mongoose");
const { User } = require("../models/User.models");
const { generateAccessToken, generateRefreshToken } = require("../utils/TokenUtilities");
// const { generateRefreshToken, generateRefreshToken } = require("../middlewares/Authentication.middlewares");
// const dotenv = require("dotenv");

// dotenv.config();

exports.login = async function (body) {
    const { email, password } = body;

    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    const existingUserByEmail = await User.findOne({ email: email }); 
    if (!existingUserByEmail) {
        throw new Error("User doesn't exist");
    }
    console.log("data: ", existingUserByEmail);

    // cehck SHA256 (didecrypt)
    const isPasswordMatch = existingUserByEmail.password === password;
    if (!isPasswordMatch) {
        throw new Error("Wrong password");
    }

    const accessToken = generateAccessToken(existingUserByEmail);
    const refreshToken = generateRefreshToken(existingUserByEmail);

    return { message: "Token generated successfully", data: {accessToken, refreshToken} };
};

exports.register = async function (body) {
    const { _id, name, role, email, password } = body;

    if (!_id) {
        throw new Error("ID is required");
    }
    if (!name) {
        throw new Error("Name is required");
    }
    if (!role) {
        throw new Error("Role is required");
    }
    if (!email) {
        throw new Error("Email is required");
    }
    if (!password) {
        throw new Error("Password is required");
    }

    //SHA256 buat pass baru simpen ke db
    // const hashedPassword = 
    
    const existingUser = await User.findOne({ email }); 
    if (existingUser) {
        throw new Error("User already exists");
    }

    const newUser = new User({ _id: _id, name: name, role: role, email: email, password: hashedPassword });
    await newUser.save();
    return { message: "User registered successfully", data: newUser };
    
};

exports.refreshToken = async function(body, params) {
    const { userId } = params;
    if (!userId) {
        throw new Error("User ID is required");
    } 

    const { tokenUserId } = body;
    if (!tokenUserId) {
        throw new Error("User ID is required");
    } 
    
    const isVerify = userId == tokenUserId
    if (!isVerify) {
        throw new Error("token and id is not valid")
    }
    
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    } 

    const newToken = generateAccessToken(user);

    return {
        message: "User token refreshed",
        data: newToken
    }
}

exports.getAccessToken = async function(params) {
    const { userId } = params;
    if (!userId) {
        throw new Error("User ID is required");
    } 

    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    } 

    const existingToken = user.token;
    if (!existingToken) {
        throw new Error("Token not found");
    }

    return {
        message: "User token received successfully",
        data: existingToken
    }
};

exports.getAllUsers = async function() {
    const existingUser = await User.find();
    if (!existingUser) {
        throw new Error("User not found");
    }    

    return {
        message: "All users data received successfully",
        data: existingUser
    }
};

exports.getUserById = async function(params) {
    const { userId } = params;
    if (!userId) {
        throw new Error("User ID is required");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }    

    return {
        message: "User data received successfully",
        data: user
    }
};

exports.logout = async function (params) {
    const { userId } = params;
    const user = User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    const existingToken = user.token;
    if (!existingToken) {
        throw new Error("No token provided");
    }

    existingToken = null; //delete the current token 
    await user.save();

    return {
        message: "Logout successful!"
    }
};