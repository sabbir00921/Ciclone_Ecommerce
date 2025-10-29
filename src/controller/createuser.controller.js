const { asyncHandaler } = require("../utils/async.Handler");
const { CustomError } = require("../helpers/customError");
const { apiResponse } = require("../utils/apiResponse");
const userModel = require("../model/user.model");
const roleModel = require("../model/role.model");
const permissionsModel = require("../model/permissions.model");

const { uploadCloudinary, deleteCloudinary } = require("../helpers/cloudinary");
const { validateUserCtrate } = require("../validation/usercreate.validation");
const {
  validateUserPermissions,
} = require("../validation/userpermation.validation");
const { newUserCreatedByAdmin } = require("../template/registration.template");
const { mailer } = require("../helpers/nodemailer");

// create product
exports.createUser = asyncHandaler(async (req, res) => {
  const data = await validateUserCtrate(req);
  // upload image into cloudinary
  if (data.image) {
    const imageAsset = await uploadCloudinary(data.image.path);
    if (!imageAsset) throw new CustomError(401, "Image uload failes");
    data.image = imageAsset;
  }

  // now create the user
  const createdUser = await userModel.create({
    ...data.value,
    image: data?.image,
  });
  if (!createdUser) throw new CustomError(401, "User created failed");
  const newUser = await userModel.findById(createdUser._id).populate("role");
  if (newUser.role.length == 0) {
    await userModel.findByIdAndDelete({ _id: createdUser._id });
    throw new CustomError(401, "Role not found try with valid role");
  }

  // send confirmation mail to user
  if (newUser?.email) {
    let template = newUserCreatedByAdmin(newUser, data.value?.password);
    sentMail("Account is created", template, newUser?.email);
  }

  // // send confirmation message to user
  // if (shippingInfo?.phone || updatedOrder?.shippingInfo?.phone) {
  //   let smsTemplate = `Hi ${updatedOrder.shippingInfo.fullName}, your order (Invoice: ${updatedOrder?.invoiceId}) has been confirmed. For more details check email. Thank you for shopping with us! by GURU`;
  //   sentMessage(
  //     shippingInfo?.phone || updatedOrder?.shippingInfo?.phone,
  //     smsTemplate
  //   );
  // }

  apiResponse.sendSucess(res, 200, "User created successful", newUser);
});

const sentMail = async (subject, template, email) => {
  await mailer(subject, template, email);
  // console.log("Sent email message now off");
};
// // sent confirmation mail
const sentMessage = async (number, template) => {
  const response = await smsSender(number, template);
  // console.log("Sent confimnation message now off for save money");
};

//! get all user
exports.getalluser = asyncHandaler(async (req, res) => {
  const permittedUsers = await userModel
    .find({
      role: { $exists: true, $ne: [] },
    })
    .populate("permissions.permissionId")
    .populate("role")
    .sort({ createdAt: -1 });
  if (!permittedUsers || permittedUsers.length == 0)
    throw new CustomError(401, "No permitted user found");
  apiResponse.sendSucess(res, 200, "User created successful", permittedUsers);
});

// add user permission
exports.addPermission = asyncHandaler(async (req, res) => {
  const { userId, permissions } = await validateUserPermissions(req);
  // find user

  const user = await userModel.findOneAndUpdate(
    { _id: userId },
    { permissions: permissions },
    { new: true }
  );

  apiResponse.sendSucess(res, 200, "User permission", user);
});
