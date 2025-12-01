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
        name: {
          type: String,
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
    grosstotalAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    deliveryCharge: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
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
    paymentInfo: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    transactionId: {
      type: String,
      default: null,
    },
    validId: {
      type: String,
      default: null,
    },

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Hold",
        "Confirmed",
        "Packaging",
        "cancelled",
        // "courierPending",
        // "courier",
        // "shipped",
        // "delivered",
      ],
      default: "Pending",
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
      default: "Complete",
    },
    // followUp: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   default: null,
    // },
    totalQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
