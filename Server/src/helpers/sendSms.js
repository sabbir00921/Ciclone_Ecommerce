const axios = require("axios");

const { CustomError } = require("./customError");

exports.smsSender = async (number, message) => {
  try {
    const smsResponse = await axios.post(process.env.BULKSMS_API, {
      api_key: process.env.BULKSMS_API_KEY,
      senderid: process.env.SENDER_ID,
      number: Array.isArray(number) ? number.join(",") : number,
      message: message,
    });
    return smsResponse.data;
  } catch (error) {
    console.log(error);
    throw new CustomError(501, "Eorror accure from sent sms", error);
  }
};
