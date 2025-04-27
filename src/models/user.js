const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        lowercase: true,
        trim: true,
        maxLength: 50
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address : " + value)
            }
        }
    },
    password: {
        type: String,
        required: true,

        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error(value + " is a Weak password, Enter Strong Password...")
            }
        }
    },
    age: {
        type: Number,
        min: 18,
        default: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369988.png",

        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid URL : " + value)
            }
        }
    },
    about: {
        type: String,
        default: "This is user's default about",
    },
    skills: {
        type: [String],
        default: "huehue",
    }
}, { timestamps: true });

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = jwt.sign({ _id: user._id }, "djfhbufhbi", { expiresIn: "7d", });
    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);