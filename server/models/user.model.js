const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const user = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    firstName: {
      type: String,
      minLength: [1, "field is empty"],
      maxLength: [10, "field is too long"],
      required: true,
    },
    lastName: {
      type: String,
      minLength: [1, "field is empty"],
      maxLength: [10, "field is too long"],
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      required: true,
    },

    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    changedPassword: Date,
  },
  { timestamps: true }
);

user.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  let isPasswordCorrect;

  if (user) {
    isPasswordCorrect = await bcrypt.compare(password, user.password);
  }
  if (!user || !isPasswordCorrect) {
    throw Error("Password or email aren't correct");
  }

  return user;
};

user.statics.signup = async function (email, password, firstName, lastName) {
  const user = await this.findOne({ email });

  if (user) {
    throw Error("this email is already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await this.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
  });

  return newUser;
};

user.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpires = Date.now() + 24 * 60 * 60 * 1000;

  return resetToken;
};

const UserModel = mongoose.model("users", user);

module.exports = UserModel;
