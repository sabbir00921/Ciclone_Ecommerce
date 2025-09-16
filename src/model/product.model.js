const mongoose = require("mongoose");
const slugify = require("slugify");
const { Schema } = mongoose;
const { CustomError } = require("../helpers/customError");

// Review Schema
const reviewSchema = new Schema(
  {
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    image: [
      {
        type: String,
        default: null,
      },
    ],
  },
  { timestamps: true }
);

// Product Schema
const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },

    // Relations
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subCategory",
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    discount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "discount",
    },
    image: [{}],
    tag: [
      {
        type: String,
        trim: true,
      },
    ],
    manufactureCountry: {
      type: String,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    warrantyInformation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warranty",
    },
    shippingInformation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipping",
    },
    variant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
    },

    // Availability
    availability: {
      type: Boolean,
      default: true,
    },

    // Reviews
    review: [reviewSchema],

    // Stock & Inventory
    sku: {
      type: String,
      unique: true,
    },
    qrcode: {
      type: String,
    },
    barcode: {
      type: String,
    },
    groupList: {
      type: String,
      enum: ["box", "package", "dozen", "custom"],
    },
    groupUnitQuantity: {
      type: Number,
      default: 1,
    },
    groupUnit: {
      type: String,
      enum: ["price", "kg", "gram", "liter", "packet"],
    },
    size: [
      {
        type: String,
      },
    ],
    color: [
      {
        type: String,
      },
    ],
    totalStock: {
      type: Number,
      default: 0,
    },
    warehouseLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
    },

    // Pricing
    purchasePrice: {
      type: Number,
    },
    retailPrice: {
      type: Number,
    },
    wholesalePrice: {
      type: Number,
    },
    minimumWholeSaleOrderQuantity: {
      type: Number,
      default: 100,
    },
    minimumOrder: {
      type: Number,
      default: 1,
    },

    // Status
    inStock: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    variantType: {
      type: String,
      enum: ["single", "multiple"],
    },
  },
  { timestamps: true }
);

// Auto-generate slug
productSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  const existing = await this.constructor.findOne({ slug: this.slug });
  if (existing && !existing._id.equals(this._id)) {
    throw new CustomError(401, `${this.name} already exists!! Try another one`);
  }
  next();
});

// Default sorting
productSchema.pre("find", function (next) {
  this.sort({ createdAt: -1 });
  next();
});

// Update slug on name change
productSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.name) {
    const newSlug = slugify(update.name, {
      lower: true,
      strict: true,
      trim: true,
    });

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

productSchema.pre("save", function (next) {
  if (!this.sku) {
    this.sku = `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);
