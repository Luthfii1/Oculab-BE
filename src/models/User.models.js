const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const RoleType = Object.freeze({
    ADMIN: "ADMIN",
    LAB: "LAB",
});

const UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        default: uuidv4,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: Object.values(RoleType),
        required: true,
    },
    // token: { // Store access token first, then refresh token after expiration
    //     type: String,
    //     required: false, // setelah logout kosongin lg
    // },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const User = mongoose.model("User", UserSchema);

module.exports = {
    UserSchema,
    User
};
