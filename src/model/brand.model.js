const mongoose = require("mongoose");
const slugify = require("slugify");
const { Schema } = mongoose;
const { CustomError } = require("../helpers/customError");

const brandSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    image: {},
    slug: {
      type: String,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-generate slug on save
brandSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: false,
      trim: true,
    });
  }
  next();
});

// Update slug on findOneAndUpdate
brandSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.name) {
    const newSlug = slugify(update.name, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: false,
      trim: true,
    });

    // check if slug already exists
    const existing = await this.model.findOne({ slug: newSlug });
    if (
      existing &&
      existing._id.toString() !== this.getQuery()._id?.toString()
    ) {
      return next(
        new CustomError(401, "Brand name already exists, choose another one")
      );
    }
    update.slug = newSlug;
    this.setUpdate(update);
  }

  next();
});

// check if brand already exists with same slug
brandSchema.pre("save", async function (next) {
  const isExist = await this.constructor.findOne({ slug: this.slug });

  if (isExist && !isExist._id.equals(this._id)) {
    throw new CustomError(401, `{${this.name}} already exists! Try another one`);
  }
  next();
});

module.exports = mongoose.models.Brand || mongoose.model("Brand", brandSchema);
