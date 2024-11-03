const { User } = require("../models/Entity/User.models");
const { generateAccessToken, generateRefreshToken } = require("../utils/TokenUtilities");
const { hashPassword } = require("../utils/PasswordUtilities");
const globalSalt = process.env.GLOBAL_SALT;

exports.login = async function (body) {
    const { email, password } = body;

    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    const existingUser = await User.findOne({ email: email }); 
    if (!existingUser) {
        throw new Error("User doesn't exist");
    }
    console.log("data: ", existingUser);

    const hashedPassword = hashPassword(password, globalSalt);
    if (hashedPassword !== existingUser.password) {
        throw new Error("Incorrect password");
    }

    const accessToken = generateAccessToken(existingUser);
    const refreshToken = generateRefreshToken(existingUser);

    return { message: "Token generated successfully", data: {accessToken, refreshToken} };
};

exports.register = async function (body) {
    const { _id, name, role, email, password } = body;

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
    
    const existingUser = await User.findOne({ email }); 
    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = hashPassword(password, globalSalt);

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