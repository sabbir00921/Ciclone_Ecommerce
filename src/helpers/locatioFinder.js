const axios = require("axios");
const { CustomError } = require("./customError");

exports.locationFinder = async (req) => {
  try {
    // Client IP বের করা
    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.connection.remoteAddress;

    // ip-api.com দিয়ে location fetch করা
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new CustomError(501, "Location find error", error);
  }
};