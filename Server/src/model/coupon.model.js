const mongoose = require("mongoose");
const { Schema } = mongoose;
const { CustomError } = require("../helpers/customError");
const slugify = require("slugify");

const couponSchema = new Schema(
  {
    slug: {
      type: String,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      uppercase: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "tk"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    expireAt: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: 1,
      min: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// Create slug from code if not provided
couponSchema.pre("save", async function (next) {
  if (!this.slug || this.isModified("code")) {
    this.slug = slugify(this.code, {
      lower: true,
      trim: true,
    });
  }
  next();
});

// Ensure slug is unique
couponSchema.pre("save", async function (next) {
  const isExist = await this.constructor.findOne({
    slug: this.slug,
  });

  if (isExist && !isExist._id.equals(this._id)) {
    throw new CustomError(
      401,
      `${this.code} coupon already exists! Try another one`
    );
  }
  next();
});

// Check expire date
couponSchema.methods.isExpired = function () {
  return new Date() > this.expireAt;
};

// Check availability
couponSchema.methods.isAvailable = function () {
  return !this.isExpired() && this.usedCount < this.usageLimit;
};

module.exports =
  mongoose.model.Coupon || mongoose.model("Coupon", couponSchema);
