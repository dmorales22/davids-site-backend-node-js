const ContactMessage = require("../models/ContactMessage");
const Nodemailer = require("../api/nodemailer");
const mongoose = require("mongoose");

/**
 * This function logs the interactions of a page when someone visits it.
 * @param {object} req
 * @param {object} res
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.createContactMessage = async (req, res) => {
  if (!req.body.email || !req.body.subject || !req.body.content) {
    return res.status(400).send({
      result: false,
      msg: "Error. Something is wrong with this request.",
    });
  }
  try {
    let email = req.body.email;
    email = email.toLowerCase();

    if (email.length > 250) {
      return res.status(400).send({
        result: false,
        msg: "Error. Something is wrong with this request.",
      });
    }

    let subject = req.body.subject;

    if (subject.length > 1000) {
      return res.status(400).send({
        result: false,
        msg: "Error. Something is wrong with this request.",
      });
    }

    let content = req.body.content;

    if (content.length > 50000) {
      return res.status(400).send({
        result: false,
        msg: "Error. Something is wrong with this request.",
      });
    }

    const newContactMessage = await ContactMessage.create({
      email: email,
      subject: subject,
      content: content,
      user_agent: req.headers["user-agent"],
      ipv4: req.body.ipv4,
      ipv6: req.body.ipv6,
    });

    //Checks if an email was provided
    const email_content =
      "Sender Email: " +
      email +
      "\nSender Subject: " +
      subject +
      "\nSender Content: " +
      content +
      "\nUser Agent: " +
      req.headers["user-agent"] +
      "\nIPv4: " +
      req.body.ipv4 +
      "\nIPv6: " +
      (req.body.ipv6 || "N/A");
    await Nodemailer.sendEmailLocal(
      //Sends an email of parking registration confirmation
      process.env.EMAILTOSENDTO,
      subject,
      email_content
    );

    await newContactMessage.save((err) => {
      if (err) {
        return console.log(err);
      }
      return res.send({ result: true, msg: "Message has been sent!" });
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ result: false, msg: "There was an error. Try again later." });
  }
};
