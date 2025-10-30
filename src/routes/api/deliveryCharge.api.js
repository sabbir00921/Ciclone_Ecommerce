const express = require("express");
const deliveryChargeController = require("../../controller/deliveryCharge.controller");
const { authGuard } = require("../../middleware/auth.middleware");
const { authorized } = require("../../middleware/authorize.middleware");
const _ = express.Router();

_.route("/create-deliveryCharge").post(authGuard,
  authorized("delivery", "add"),
  deliveryChargeController.createDeliveryCharge
);
_.route("/get-deliveryCharge").get(deliveryChargeController.allDeliveryCharge);
_.route("/single-deliveryCharge/:id").get(
  deliveryChargeController.singleDeliveryCharge
);
_.route("/update-deliveryCharge/:id").put(authGuard,
  authorized("delivery", "edit"),
  deliveryChargeController.updateDeliveryCharge
);
_.route("/delete-deliveryCharge/:id").delete(authGuard,
  authorized("delivery", "delete"),
  deliveryChargeController.deleteDeliveryCharge
);

module.exports = _;
