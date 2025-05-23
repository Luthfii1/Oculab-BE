const { User } = require("../models/Entity/User.models");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/TokenUtilities");
const {
  hashPassword,
  generateRandomPassword,
} = require("../utils/PasswordUtilities");
const { generateUniqueUsername } = require("../utils/UsernameUtilities");
const emailService = require("./Email.service");

exports.login = async function (body) {
  const { username, password } = body;
  if (!username || !password) {
    throw new Error("Username and password are required");
  }

  const existingUser = await User.findOne({ username: username });
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
  const { _id, name, role, email, accessPin } = body;
  if (!name) {
    throw new Error("Name is required");
  }
  if (!role) {
    throw new Error("Role is required");
  }
  if (!email) {
    throw new Error("Email is required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const username = await generateUniqueUsername(name);
  const randomPassword = generateRandomPassword();
  const hashedPassword = hashPassword(randomPassword);

  const isIdDuplicate = await User.findById(_id);
  if (isIdDuplicate) {
    throw new Error("Duplicate ID");
  }

  const newUser = new User({
    _id: _id,
    name: name,
    role: role,
    email: email,
    username: username,
    password: hashedPassword,
    accessPin: accessPin,
  });

  try {
    await Promise.all([
      newUser.save(),
      emailService.sendWelcomeEmail(email, username, randomPassword),
    ]);

    return {
      userId: newUser._id,
      username: newUser.username,
      currentPassword: randomPassword,
    };
  } catch (error) {
    throw new Error("REGISTRATION_FAILED");
  }
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
  const users = await User.find()
    .select("name role email username")
    .sort({ name: 1 }); //ascending order

  if (!users || users.length === 0) {
    throw new Error("No users found");
  }

  return users;
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

exports.updateUserPassword = async function (body, params) {
  const { userId } = params;
  if (!userId || userId === ":userId") {
    throw new Error("User ID is required");
  }

  const { newPassword, previousPassword } = body;
  if (!newPassword || !previousPassword) {
    throw new Error("New and previous password is required");
  }

  const existingUser = await User.findById(userId);

  const hashedPreviousPassword = hashPassword(previousPassword);
  if (hashedPreviousPassword !== existingUser.password) {
    throw new Error("Invalid previous password"); //check if user's new pass input matched the actual pass
  }

  const hashedNewPassword = hashPassword(newPassword);
  if (hashedPreviousPassword == hashedNewPassword) {
    throw new Error("Password must be different from the previous one");
  }

  existingUser.password = hashedNewPassword;
  await existingUser.save();

  return {
    userId: existingUser._id,
    username: existingUser.username,
    newPassword: newPassword,
  };
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

exports.deleteUser = async function (params) {
  const { userId } = params;

  if (!userId || userId === ":userId") {
    throw new Error("User ID is required");
  }

  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    throw new Error("User not found or already deleted");
  }

  const userResponse = deletedUser.toObject();

  return {
    userId: userResponse._id,
    name: userResponse.name,
    role: userResponse.role,
    email: userResponse.email,
    username: userResponse?.username,
  };
};
