const mongoose = require("mongoose");
const chalk = require("chalk");
require("dotenv").config();
const roleModel = require("../model/role.model");
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
const seedRole = async () => {
  try {
    // Define default roles
    const roles = [
      { name: "admin" },
      { name: "manager" },
      { name: "salesman" },
      { name: "owner" },
      { name: "user" },
      { name: "pokei" },
    ];
    // Fetch existing role names from DB
    const existingRoles = await roleModel.find({}, "name");
    const existingNames = existingRoles.map((r) => r.name.toLowerCase());

    // Filter out roles that already exist
    const newRoles = roles.filter(
      (r) => !existingNames.includes(r.name.toLowerCase())
    );
    // Create all roles in parallel
    const createdRoles = await Promise.all(
      newRoles.map((role) => roleModel.create(role))
    );

    // Check if creation succeeded
    if (!createdRoles || createdRoles.length === 0) {
      throw new CustomError(401, "Role creation failed");
    }

    console.log("Roles created successfully:", createdRoles);
  } catch (error) {
    throw new CustomError(401, error.message);
  }
};

connectDatabase().then(() => seedRole());

