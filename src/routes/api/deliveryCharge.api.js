const express = require("express");
const deliveryChargeController = require("../../controller/deliveryCharge.controller");
const _ = express.Router();

_.route("/create-deliveryCharge").post(
  deliveryChargeController.createDeliveryCharge
);
_.route("/get-deliveryCharge").get(deliveryChargeController.allDeliveryCharge);
_.route("/single-deliveryCharge/:id").get(
  deliveryChargeController.singleDeliveryCharge
);
_.route("/update-deliveryCharge/:id").put(
  deliveryChargeController.updateDeliveryCharge
);
_.route("/delete-deliveryCharge/:id").delete(
  deliveryChargeController.deleteDeliveryCharge
);

module.exports = _;
