const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

/**
 * This function is to send emails to recipients.
 * This is mainly for testing email functionality.
 * @param {object} req
 * @param {object} res
 * @returns {Promise<void>}
 * @author David Morales
 */
exports.sendEmail = async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: req.body.email_to,
      subject: req.body.subject,
      text: req.body.text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.send(error);
      } else {
        console.log(info);
        return res.send(info);
      }
    });
  } catch (e) {
    res.send(e);
    console.log(e);
  }
};

/**
 * This function is to send an email to a recipient(s). This is a local function meant to be called by other functions
 * @param {string} recipient_email
 * @param {string} subject
 * @param {string} content
 * @returns {Promise<boolean|*>}
 * @author David Morales
 */
exports.sendEmailLocal = async (
  recipient_email,
  subject,
  content,
  attachments
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_FROM,
      to: recipient_email,
      subject: subject,
      text: content,
    };

    if (attachments) {
      mailOptions.attachments = attachments;
    }

    return await transporter.sendMail(mailOptions);
  } catch (e) {
    console.log(e);
    return false;
  }
};
