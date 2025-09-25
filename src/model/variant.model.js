const mongoose = require("mongoose");
const slugify = require("slugify");
const { Schema } = mongoose;
const { CustomError } = require("../helpers/customError");

const variantSchema = new Schema(
  {
    variantName: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "product",
      required: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    barCode: {
      type: String,
      trim: true,
    },
    qrCode: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    stockVariant: {
      type: Number,
      default: 0,
    },
    warehouseLocation: {
      type: mongoose.Types.ObjectId,
      ref: "Warehouse",
    },
    alertVariantStock: {
      type: Number,
      default: 0,
    },
    purchasePrice: {
      type: Number,
      required: true,
    },
    retailPrice: {
      type: Number,
      default: 0,
    },
    wholeSalePrice: {
      type: Number,
    },
    stockAlert: {
      type: Number,
      default: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    image: [{}],
  },
  { timestamps: true }
);

// Generate slug from variantName before save
variantSchema.pre("save", async function (next) {
  if (this.isModified("variantName")) {
    this.slug = slugify(this.variantName, {
      replacement: "-",
      lower: true,
      trim: true,
    });
  }
  next();
});

// Ensure slug is unique
variantSchema.pre("save", async function (next) {
  if (!this.slug) return next();
  const exists = await this.constructor.findOne({ slug: this.slug });
  if (exists && !exists._id.equals(this._id)) {
    throw new CustomError(
      401,
      `${this.variantName} already exists! Try another name.`
    );
  }
  next();
});

module.exports =
  mongoose.models.Variant || mongoose.model("Variant", variantSchema);
