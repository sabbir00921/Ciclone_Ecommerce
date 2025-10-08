const { required } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const invoiceSchema = new Schema(
  {
    invoiceId: {
      type: String,
      required: [true, "Invoice ID is required"],
      unique: true,
      trim: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order reference is required"],
    },
    customerDetails: {},
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    finalAmount: {
      type: Number,
      required: [true, "Final amount is required"],
      min: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);
