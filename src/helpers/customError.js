class CustomError extends Error {
  constructor(statusCode, message,data = null) {
    super(message);
    this.status =
      statusCode >= 400 && statusCode < 500 ? "client Error" : "server Error";
    this.statusCode = statusCode;
    this.isOperationalError =
      statusCode >= 400 && statusCode < 500 ? false : true;
    this.data = data;
  }
}

module.exports = { CustomError };

/**
 * Error are two typers. operational and non-operational.
 * -------------------------------------------------------
 * Server failed or erroe is operational error
 * Client error is non operational error
 */
