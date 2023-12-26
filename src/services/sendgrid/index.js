const sendgrid = require("@sendgrid/mail");
const { SENDGRID_API_KEY, SENDGRID_FROM_EMAIL } = require("../../utils/config");
const logger = require("../../utils/logger");

sendgrid.setApiKey(SENDGRID_API_KEY);

const from = SENDGRID_FROM_EMAIL;

const sendEmail = async ({ to, subject, text }) => {
  try {
    return await sendgrid.send({
      to,
      from,
      subject,
      text
      //   html: "<strong>and easy to do anywhere, even with Node.js</strong>"
    });
  } catch (error) {
    logger.error("sendEmail() -> error : ", error);
    throw error;
  }
};

module.exports = { sendEmail };
