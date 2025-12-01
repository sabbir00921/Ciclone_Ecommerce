const express = require("express");
const orderController = require("../../controller/order.controller");
const { authGuard } = require("../../middleware/auth.middleware");
const _ = express.Router();

_.route("/create-order").post(authGuard, orderController.createOrder);
_.route("/all-order").get(authGuard, orderController.allOrder);
_.route("/update-order/:id").put(authGuard, orderController.updateOrder);
_.route("/status-order").get(
  authGuard,
  orderController.getAllOrderStatusAndUpdateInfo
);
_.route("/delete-order/:id").delete(authGuard, orderController.deleteOrder);
_.route("/create-courier").post(authGuard, orderController.createCourier);

module.exports = _;
