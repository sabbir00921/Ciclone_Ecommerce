const mongoose = require("mongoose");
const chalk = require("chalk");
require("dotenv").config();
const permissionsModel = require("../model/permissions.model");
const { CustomError } = require("../helpers/customError");

const connectDatabase = async () => {
  try {
    const dbinfo = await mongoose.connect(`${process.env.MONGODB_URL}/Ciclone`);
    console.log(
      chalk.yellow(`Database connection sucessfull ${dbinfo.connection.host}`)
    );
  } catch (error) {
    console.log(chalk.red("Database connection faield!!", error));
  }
};

// seed role
const seedPermission = async () => {
  try {
    // Define default roles
    const Permissions = [
      { name: "brand" },
      { name: "cart" },
      { name: "category" },
      { name: "coupon" },
      { name: "delivery" },
      { name: "discount" },
      { name: "product" },
      { name: "invoice" },
      { name: "order" },
      { name: "permission" },
      { name: "variant" },
      { name: "user" },
      { name: "role" },
      { name: "subcategory" },
    ];
    // Fetch existing role names from DB
    const existingPermissions = await permissionsModel.find({}, "name");
    const existingNames = existingPermissions.map((r) => r.name.toLowerCase());

    // Filter out roles that already exist
    const newePrmission = Permissions.filter(
      (r) => !existingNames.includes(r.name.toLowerCase())
    );

    if (!newePrmission || newePrmission.length === 0) {
      return console.log(
        chalk.green("Nothing to add in permission or no new permission for add")
      );
      // throw new CustomError(401, "Nothing to add in permission");
    }

    // Create all roles in parallel
    const createdPermissions = await Promise.all(
      newePrmission.map((permissions) => permissionsModel.create(permissions))
    );

    // Check if creation succeeded
    if (!createdPermissions || createdPermissions.length === 0) {
      throw new CustomError(401, "Permissions creation failed");
    }

    console.log("Permissions created successfully:", createdPermissions);
  } catch (error) {
    throw new CustomError(401, error.message);
  }
};

connectDatabase().then(() => seedPermission());
