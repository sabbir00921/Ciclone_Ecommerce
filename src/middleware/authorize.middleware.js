const { CustomError } = require("../helpers/customError");
const { asyncHandaler } = require("../utils/async.Handler");

const authorized = (actions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) throw new CustomError(401, "Unauthorized access");
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { authorized };
