const mongoose = require("mongoose");
const slugify = require("slugify");
const { Schema } = mongoose;
const { CustomError } = require("../helpers/customError");

const bannerSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {},

    targetUrl: {
      type: String,
      trim: true,
    },

    targetType: {
      type: String,
      enum: ["product", "category", "brand", "external", "none"],
      default: "none",
    },

    slug: {
      type: String,
      unique: true,
    },

    priority: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Auto-generate slug on save
bannerSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, {
      replacement: "-",
      lower: true,
      trim: true,
    });
  }

  next();
});

// Update slug on findOneAndUpdate
bannerSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.title) {
    const newSlug = slugify(update.title, {
      replacement: "-",
      lower: true,
      trim: true,
    });

    // check if slug already exists
    const existing = await this.model.findOne({ slug: newSlug });
    if (
      existing &&
      existing._id.toString() !== this.getQuery()._id?.toString()
    ) {
      return next(
        new CustomError(401, "Banner title already exists, choose another one")
      );
    }

    update.slug = newSlug;
    this.setUpdate(update);
  }

  next();
});

// check duplicate slug on save
bannerSchema.pre("save", async function (next) {
  const isExist = await this.constructor.findOne({ slug: this.slug });

  if (isExist && !isExist._id.equals(this._id)) {
    throw new CustomError(
      401,
      `{${this.title}} banner already exists! Try another one`
    );
  }

  next();
});

module.exports =
  mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
