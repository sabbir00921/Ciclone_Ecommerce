const { CustomError } = require("../helpers/customError");
const { asyncHandaler } = require("../utils/async.Handler");

const authorized = (resource = null, action) => {
  return async (req, res, next) => {
    try {
      if (!req.user) throw new CustomError(401, "Unauthorized access");

      // check authorized permissions
      const isAuthorized = req?.user?.permissions.find(
        (p) => p.permissionId.slug === resource
      );
      if (!isAuthorized)
        throw new CustomError(401, `Unauthorized access permission denied!!`);
      // check authorized access for curd action
      if (!isAuthorized?.actions?.includes(action))
        throw new CustomError(401, `You are not authorized for ${action}`);

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { authorized };
