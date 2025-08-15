const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    reqired: true,
    trim: true,
    unique: [true, "Email must be unique"],
  },
  password: {
    type: String,
    trim: true,
    reqired: true,
  },
  phone: {
    type: Number,
    reqired: true,
    trim: true,
  },
  image: {
    type: String,
    reqired: true,
  },
  isEmailVerified: Boolean,
  isNumberVerified: Boolean,
  address: {
    type: String,
    reqired: true,
  },
  city: {
    type: String,
    reqired: true,
  },
  state: {
    type: String,
    reqired: true,
  },
  country: {
    type: String,
    reqired: true,
    default: "bangladesh",
  },
  zipCode: {
    type: Number,
    reqired: true,
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    trim: true,
    enum: ["male", "female", "other"],
  },
  lastLogin: Date,
  lastLogout: Date,

  cart: [
    {
      type: Types.ObjectId,
      ref: "Product",
    },
  ],
  wishList: [
    {
      type: Types.ObjectId,
      ref: "Product",
    },
  ],
  newsLatterSubscribe: Boolean,
  role: [
    {
      type: Types.ObjectId,
      ref: "Role",
    },
  ],
  permission: [
    {
      type: Types.ObjectId,
      ref: "Permission",
    },
  ],
  emailVerificationOtp: Number,
  emailVerificationExpTime: Date,
  resetPaswordOtp: Number,
  resetPaswordExpDate: Date,
  twoFactorEnabled: Boolean,
  isBlocked: Boolean,
  isActive: Boolean,
  refreshToken: {
    type: String,
    trim: true,
  },
});

// make a sash password with mongoose middleware
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // const saltRounds = 10;
    // const myPlaintextPassword = this.password;
    const hashPassword = await bcrypt.hash(this.password, 10);
    this.password = hashPassword;
  }
  next();
});

// check user email or phone already exist or not
userSchema.pre("save", async function (next) {
  const isExist = await this.constructor.findOne({
    $or: [{ email: this.email }],
  });

  if (
    isExist &&
    isExist._id.toString() !== this._id.toString() &&
    isExist._id.toString() == this._id.toString()
  ) {
    throw new Error("Email or phone already exist");
  }
  next();
});

// Compare human readable password with Hash password password method
userSchema.methods.comparePassword = async function (humanPass) {
  return await bcrypt.compare(humanPass, this.password);
};

// generate access token
userSchema.methods.generateRefreshToken = async function () {
  return  jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
      phone: this.phone,
    },
    process.env.ACCESTOKEN_SECRET,
    { expiresIn: process.env.ACCESTOKEN_EXPIRE }
  );
};

// generate refresh token
userSchema.methods.generateRefreshtoken = async function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_EXPIRE }
  );
};

// Verify access token
userSchema.methods.verifyAccessToken = async function (token) {
  return await jwt.verify(token, process.env.ACCESTOKEN_SECRET);
};

// Verify refresh token
userSchema.methods.verifyRefreshToken = async function (token) {
  return await jwt.verify(token, process.env.REFRESH_SECRET);
};
module.exports = mongoose.model("user", userSchema);
