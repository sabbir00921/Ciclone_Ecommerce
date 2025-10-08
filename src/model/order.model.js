const { required } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const orderSchema = new Schema(
  {
    // user info
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    // guest id
    guestId: {
      type: String,
      required: false,
      trim: true,
    },
    // items
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          default: null,
        },
        variant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Variant",
          default: null,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        totalPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        size: {
          type: String,
          default: "N/A",
        },
        color: {
          type: String,
          default: "N/A",
        },
      },
    ],
    shippingInfo: {
      fullName: { type: String, required: false },
      phone: { type: String },
      email: { type: String },
      address: { type: String, required: false },
      country: { type: String, default: "Bangladesh" },
      deliveryZone: { type: String },
    },

    deliveryCharge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryCharge",
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      default: 0,
    },
    discountType: {
      type: String,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "sslcommerz"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed", "cancelled"],
      default: "pending",
    },
    transactionId: {
      type: String,
      default: null,
    },
    validId: {
      type: String,
      default: null,
    },
    deliveryCharge: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "hold",
        "confirmed",
        "packaging",
        // "courierPending",
        // "courier",
        // "shipped",
        // "delivered",
        // "cancelled",
      ],
      default: "pending",
    },
    invoiceId: {
      type: String,
      default: null,
    },
    courier: {
      name: {
        type: String,
        default: null,
      },
      trackingId: {
        type: String,
        default: null,
      },
      rawResponse: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },
      status: {
        type: String,
        default: "pending",
      },
    },
    orderType: {
      type: String,
      default: "complete",
    },
    followUp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    totalQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
