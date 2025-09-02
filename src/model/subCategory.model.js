const mongoose = require("mongoose");
const slugify = require("slugify");
const { Schema } = mongoose;
const { CustomError } = require("../helpers/customError");

const subCategorySchema = new Schema(
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
    isAvailable: {
      type: Boolean,
      default: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true, // every subCategory must belong to a Category
    },
    discount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "discount",
    },
  },
  { timestamps: true }
);

// make a slug automatically
subCategorySchema.pre("save", async function (next) {
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
// upadet slugyfi when usef findOneAndUpdate
subCategorySchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.name) {
    const newSlug = slugify(update.name, {
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

// check if subCategory already exists with same slug
subCategorySchema.pre("save", async function (next) {
  const isExist = await this.constructor.findOne({ slug: this.slug });

  if (isExist && !isExist._id.equals(this._id)) {
    throw new CustomError(401, `${this.name} already exist!! Try another one`);
  }
  next();
});

// // populate
// subCategorySchema.pre("find", function autopopulate(next) {
//   this.populate("category");
//   next();
// });
// subCategorySchema.pre("findOneAndUpdate", function autopopulate(next) {
//   this.populate("category");
//   next();
// });

module.exports =
  mongoose.models.subCategory ||
  mongoose.model("subCategory", subCategorySchema);
