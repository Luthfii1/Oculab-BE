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

  const response = {
    accessToken,
    refreshToken,
    userId: existingUser._id,
  };

  return response;
};

exports.register = async function (body) {
  const { _id, name, role, email, password, accessPin } = body;
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

  const isIdDuplicate = await User.findById(_id);
  if (isIdDuplicate) {
    throw new Error("Duplicate ID");
  }

  const newUser = new User({
    _id: _id,
    name: name,
    role: role,
    email: email,
    password: hashedPassword,
    accessPin: accessPin,
  });
  await newUser.save();

  const response = newUser.toObject();
  delete response.__v;

  return response;
};

exports.refreshToken = async function (body, params) {
  const { userId } = params;
  if (!userId || userId === ":userId") {
    throw new Error("User ID is required");
  }

  const { tokenUserId } = body;
  if (!tokenUserId) {
    throw new Error("Token ID is required");
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

  return { accessToken: newToken };
};

exports.getAllUsers = async function () {
  const existingUser = await User.find();
  if (!existingUser) {
    throw new Error("User not found");
  }

  return existingUser;
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
  delete userResponse.__v;

  return userResponse;
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
    delete userObj.accessPin;

    return userObj;
  });

  return pics;
};

exports.updateUser = async function (body, params) {
  const { userId } = params;
  if (!userId || userId === ":userId") {
    throw new Error("User ID is required");
  }

  const { name, role, email, password, accessPin, previousPassword } = body;

  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new Error("User not found");
  }

  if (name) {
    existingUser.name = name;
  }
  if (role) {
    existingUser.role = role;
  }
  if (email) {
    existingUser.email = email;
  }
  if (password) {
    if (!previousPassword) {
      throw new Error("Previous password is required");
    }
    const hashedPreviousPassword = hashPassword(previousPassword);
    if (hashedPreviousPassword !== existingUser.password) {
      throw new Error("Incorrect previous password");
    }

    existingUser.password = hashPassword(password);
  }
  if (accessPin) {
    existingUser.accessPin = accessPin;
  }

  await existingUser.save();
  const userResponse = existingUser.toObject();
  delete userResponse.password;
  delete userResponse.__v;

  return userResponse;
};
