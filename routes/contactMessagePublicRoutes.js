const express = require("express");
const ContactMessage = require("../controllers/contactMessageController");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 15 create account requests per `window` (here, per hour)
  message: "Too many request! Try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.post("/api/v1/contact-message", loginLimiter, (req, res) => {
  ContactMessage.createContactMessage(req, res);
});

module.exports = router;
