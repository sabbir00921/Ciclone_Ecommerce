const mongoose = require("mongoose");
const { Schema } = mongoose;
const { CustomError } = require("../helpers/customError");

const DeliveryChargeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is reqired"],
      trim: true,
    },
    deliveryCharge: {
      type: Number,
      required: [true, "DeliveryCharge Required"],
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to check if delivery name already exists
DeliveryChargeSchema.pre("save", async function (next) {
  const isExist = await this.constructor.findOne({ name: this.name.trim() });
  if (isExist) {
    throw new CustomError(401, "Delivery option with this name already exists");
  }
  next();
});

module.exports =
  mongoose.models.DeliveryCharge ||
  mongoose.model("DeliveryCharge", DeliveryChargeSchema);
