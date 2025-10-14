const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    guestId: {
      type: String,
      required: false,
      trim: true,
    },
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
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },
    couponCode: {
      type: String,
      default: null,
    },
    grosstotalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    totalQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountType: {
      type: String,
    },
  },
  { timestamps: true }
);

// auto calculate totals before save
cartSchema.pre("save", function (next) {
  // calculate items total
  this.totalPrice = this.items.reduce((acc, item) => acc + item.total, 0);

  // ensure afterApplyCouponPrice always updated
  if (this.coupon) {
    this.afterApplyCouponPrice = this.totalPrice - this.discountPrice;
  } else {
    this.afterApplyCouponPrice = this.totalPrice;
  }

  next();
});

module.exports = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
