const { User } = require("../models/Entity/User.models");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/TokenUtilities");
const {
  hashPassword,
  generateRandomPassword,
} = require("../utils/PasswordUtilities");
const emailService = require("./Email.service");
const { RolesType } = require("../models/Enum/RolesType.enum");

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
    password: hashedPassword,
    accessPin: accessPin,
  });

  try {
    await Promise.all([
      newUser.save(),
      emailService.sendWelcomeEmail(email, randomPassword),
    ]);

    return {
      userId: newUser._id,
      email: newUser.email,
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
    email: existingUser.email,
    newPassword: newPassword,
  };
};

exports.updateUserAccessPin = async function (body, params) {
  const { userId } = params;
  if (!userId || userId === ":userId") {
    throw new Error("User ID is required");
  }

  const { newAccessPin, previousAccessPin } = body;
  if (!newAccessPin || !previousAccessPin) {
    throw new Error("New and previous password is required");
  }

  const existingUser = await User.findById(userId);

  if (previousAccessPin !== existingUser.accessPin) {
    throw new Error("Invalid previous password"); //check if user's new pass input matched the actual pass
  }

  if (newAccessPin == existingUser.accessPin) {
    throw new Error("Password must be different from the previous one");
  }

  existingUser.accessPin = newAccessPin;
  await existingUser.save();

  return {
    userId: existingUser._id,
    email: existingUser.email,
    newAccessPin: existingUser.accessPin,
  };
};

exports.updateUser = async function (body, params) {
  const { userId } = params;
  if (!userId || userId === ":userId") {
    throw new Error("User ID is required");
  }
  const { name, role, email } = body;

  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new Error("User not found");
  }

  if (email && email !== existingUser.email) {
    throw new Error("Email cannot be changed");
  }

  if (name) {
    existingUser.name = name;
  }
  if (role) {
    const validRoles = Object.values(RolesType);
    if (!validRoles.includes(role)) {
      throw new Error(`Invalid role. Must be one of: ${validRoles.join(", ")}`);
    }
    existingUser.role = role;
  }

  await existingUser.save();

  return {
    userId: existingUser._id,
    name: existingUser.name,
    role: existingUser.role,
    email: existingUser.email,
  };
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
