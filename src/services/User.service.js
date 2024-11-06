const { User } = require("../models/Entity/User.models");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/TokenUtilities");
const { hashPassword } = require("../utils/PasswordUtilities");

exports.login = async function (body) {
  const { email, password } = body;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const existingUser = await User.findOne({ email: email });
  if (!existingUser) {
    throw new Error("User doesn't exist");
  }

  const hashedPassword = hashPassword(password);
  if (hashedPassword !== existingUser.password) {
    throw new Error("Incorrect password");
  }

  const accessToken = generateAccessToken(existingUser);
  const refreshToken = generateRefreshToken(existingUser);

  return {
    message: "Token generated successfully",
    data: { accessToken, refreshToken },
  };
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

  const hashedPassword = hashPassword(password);

  const newUser = new User({
    _id: _id,
    name: name,
    role: role,
    email: email,
    password: hashedPassword,
  });
  await newUser.save();

  const response = newUser.toObject();
  delete response.__v;

  return { message: "User registered successfully", data: response };
};

exports.refreshToken = async function (body, params) {
  const { userId } = params;
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { tokenUserId } = body;
  if (!tokenUserId) {
    throw new Error("User ID is required");
  }

  const isVerify = userId == tokenUserId;
  if (!isVerify) {
    throw new Error("token and id is not valid");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const newToken = generateAccessToken(user);

  return {
    message: "User token refreshed",
    data: newToken,
  };
};

exports.getAllUsers = async function () {
  const existingUser = await User.find();
  if (!existingUser) {
    throw new Error("User not found");
  }

  return {
    message: "All users data received successfully",
    data: existingUser,
  };
};

exports.getUserById = async function (params) {
  const { userId } = params;
  if (!userId || userId === ":userId") {
    throw new Error("User ID is required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const userResponse = user.toObject();
  delete userResponse.password;

  return {
    message: "User data received successfully",
    data: user,
  };
};

exports.getAllPics = async function () {
  const users = await User.find();
  if (!users) {
    throw new Error("User not found");
  }

  const pics = users.map((user) => {
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.__v;
    delete userObj.email;

    return userObj;
  });

  return {
    message: "All users data received successfully",
    data: pics,
  };
};
