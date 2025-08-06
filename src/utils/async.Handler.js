exports.asyncHandaler = (fn) => {
  return async (req, res, next) => {
    try {
      fn(req, res);
    } catch (error) {
      // console.log("Error from async handaler function");
      next(error);
    }
  };
};
