const { asyncHandaler } = require("../utils/async.Handler");
const { CustomError } = require("../helpers/customError");
const { apiResponse } = require("../utils/apiResponse");

const deliveryChargeModel = require("../model/delivery.model");

const { getIo } = require("../soket/server");

// Add deliveryCharge method
exports.createDeliveryCharge = asyncHandaler(async (req, res) => {
  console.log("/create-deliveryCharge");
  const { name, deleveryCharge, description } = req.body;
  if (!name && !deleveryCharge)
    throw new CustomError(401, "name and charge is required");

  // save into database
  const deliveryChargeInstance = await new deliveryChargeModel({ ...req.body });
  const created = await deliveryChargeInstance.save();
  if (!created) throw new CustomError(401, "deliveryCharge createfd failed");
  apiResponse.sendSucess(res, 200, "Brand created successfully!!", created);
});

// get all deliveryCharge method
exports.allDeliveryCharge = asyncHandaler(async (req, res) => {
  const deliveryCharge = await deliveryChargeModel
    .find({})
    .sort({ createdAt: -1 });
  if (!deliveryCharge || deliveryCharge.length == 0)
    throw new CustomError(401, "deliveryCharge not found");
  apiResponse.sendSucess(
    res,
    200,
    "All delevery charge successfully!!",
    deliveryCharge
  );
});

// get single deliveryCharge method
exports.singleDeliveryCharge = asyncHandaler(async (req, res) => {
  const { id } = req.params;
  const deliveryCharge = await deliveryChargeModel.findOne({ _id: id });
  if (!deliveryCharge || deliveryCharge.length == 0)
    throw new CustomError(401, "deliveryCharge createfd failed");
  apiResponse.sendSucess(
    res,
    200,
    "get single delevery charge successfully!!",
    deliveryCharge
  );
});
// update deliveryCharge method
exports.updateDeliveryCharge = asyncHandaler(async (req, res) => {
  const { id } = req.params;
  const updateDeliveryCharge = await deliveryChargeModel.findOneAndUpdate(
    { _id: id },
    { ...req.body },
    { new: true }
  );
  if (!updateDeliveryCharge || updateDeliveryCharge.length == 0)
    throw new CustomError(401, "updateDeliveryCharge  failed");
  apiResponse.sendSucess(
    res,
    200,
    "Delevery charge updated successfully!!",
    updateDeliveryCharge
  );
});

// Delete deliveryCharge method
exports.deleteDeliveryCharge = asyncHandaler(async (req, res) => {
  const { id } = req.params;
  const deleteDeliveryCharge = await deliveryChargeModel.findOneAndDelete(
    { _id: id },
    { new: true }
  );
  if (!deleteDeliveryCharge)
    throw new CustomError(401, "DeliveryCharge delete  failed");
  apiResponse.sendSucess(
    res,
    200,
    "Delevery charge delete successfully!!",
    deleteDeliveryCharge
  );
});
