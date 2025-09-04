const mongoose = require("mongoose");
const slugify = require("slugify");
const { Schema } = mongoose;
const { CustomError } = require("../helpers/customError");

const discountSchema = new Schema(
  {
    discountName: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    discountValidFrom: {
      type: Date,
      required: true,
    },
    discountValidTo: {
      type: Date,
      required: true,
    },
    discountType: {
      type: String,
      enum: ["taka", "percentage"],
      required: true,
    },
    discountValueByAmount: {
      type: Number,
      default: 0,
    },
    discountValueByPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    discountPlan: {
      type: String,
      enum: ["category", "subcategory", "product"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subCategory",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

// auto slug generate
discountSchema.pre("save", async function (next) {
  if (this.isModified("discountName")) {
    this.slug = slugify(this.discountName, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  // check for duplicate slug
  const existing = await this.constructor.findOne({ slug: this.slug });
  if (existing && !existing._id.equals(this._id)) {
    throw new CustomError(
      401,
      `${this.discountName} already exist!! Try another one`
    );
  }
  next();
});

discountSchema.pre("find", function (next) {
  this.sort({ createdAt: -1 });
  next();
});

// update slug when updating name
discountSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.discountName) {
    const newSlug = slugify(update.discountName, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: false,
      trim: true,
    });
    // check if name existance
    const existing = await this.model.findOne({ slug: newSlug });
    if (
      existing &&
      existing._id.toString() !== this.getQuery()._id?.toString()
    ) {
      return next(
        new CustomError(401, "Name already exists, choose different name")
      );
    }
    update.slug = newSlug;
    this.setUpdate(update);
  }

  next();
});

module.exports =
  mongoose.models.discount || mongoose.model("discount", discountSchema);
