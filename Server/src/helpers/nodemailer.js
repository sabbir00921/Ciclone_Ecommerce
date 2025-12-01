const nodemailer = require("nodemailer");
const { CustomError } = require("./customError");

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: process.env.NODE_ENV == "development" ? false : true,
  auth: {
    user: process.env.HOST_MAIL,
    pass: process.env.APP_PASSWORD,
  },
});

exports.mailer = async (subject,template, email) => {
  try {
    const info = await transporter.sendMail({
      from: '"VIRUS COMPUTER" <sabbir000921@gmail.com>',
      to: email,
      subject: subject,
      html: template,
    });
    // console.log(info.messageId);
  } catch (error) {
    throw new CustomError(501, "Mail sent failed" + error);
  }
};
