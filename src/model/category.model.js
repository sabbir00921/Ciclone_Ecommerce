const mongoose = require("mongoose");
const slugify = require("slugify");
const { Schema } = mongoose;
const { CustomError } = require("../helpers/customError");

const categorySchema = new Schema(
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
    subCategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subCategory",
      },
    ],
    discount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "discount",
    },
  },
  { timestamps: true }
);

// make a slug slugify
categorySchema.pre("save", async function (next) {
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

// check user email or phone already exist or not
categorySchema.pre("save", async function (next) {
  const isExist = await this.constructor.findOne({
    slug: this.slug,
  });

  if (isExist && !isExist._id.equals(this._id)) {
    throw new CustomError(401, `${this.name} already exist!! Try another one`);
  }
  next();
});

module.exports =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
