const mongoose = require("mongoose");
const slugify = require("slugify");
const { Schema } = mongoose;
const { CustomError } = require("../helpers/customError");

// Review Schema
const permissionsSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    image: {},
    slug: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-generate slug
permissionsSchema.pre("save", async function (next) {
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

// Update slug on name change
// productSchema.pre("findOneAndUpdate", async function (next) {
//   const update = this.getUpdate();

//   if (update.name) {
//     const newSlug = slugify(update.name, {
//       lower: true,
//       strict: true,
//       trim: true,
//     });

//     const existing = await this.model.findOne({ slug: newSlug });
//     if (
//       existing &&
//       existing._id.toString() !== this.getQuery()._id?.toString()
//     ) {
//       return next(
//         new CustomError(401, "Name already exists, choose different name")
//       );
//     }
//     update.slug = newSlug;
//     this.setUpdate(update);
//   }

//   next();
// });

module.exports =
  mongoose.models.Permissions ||
  mongoose.model("Permissions", permissionsSchema);
