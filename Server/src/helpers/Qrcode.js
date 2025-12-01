var QRCode = require("qrcode");
const { CustomError } = require("../helpers/customError");

exports.generateQrcode = async (text) => {
  try {
    if (!text)
      throw new CustomError(401, "Text is required to generate QR code");
    const qrCodeUrl = await QRCode.toDataURL(text, {
      errorCorrectionLevel: "H",
      type: "image/jpeg",
      quality: 0.3,
      margin: 1,
      color: {
        dark: "#000000ff",
        light: "#ffffffff",
      },
    });
    return qrCodeUrl;
  } catch (err) {
    throw new CustomError(500, "Failed to generate QR code" + err.message);
  }
};

const bwipjs = require("bwip-js");
exports.generateBarcode = async (text = "216354654") => {
  try {
    if (!text)
      throw new CustomError(401, "Text is required to generate BAR code");

    const svg = bwipjs.toSVG({
      bcid: "code128",
      text: text,
      height: 12,
      includetext: true,
      textxalign: "center",
      textcolor: "#000000",
    });
    return svg;
  } catch (error) {
    throw new CustomError(500, "Failed to generate BAR code" + error.message);
  }
};
