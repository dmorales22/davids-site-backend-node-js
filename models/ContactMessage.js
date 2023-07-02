const mongoose = require("mongoose");

/**
 *
 * @type {module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, {timestamps: boolean}, {phone: {unique: boolean, type: StringConstructor, required: boolean}, last_name: StringConstructor, first_name: StringConstructor, email: {sparse: boolean, unique: boolean, type: StringConstructor}}>}
 */
const ContactMessageSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      default: "",
    },
    subject: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    flagged: {
      type: Boolean,
      default: false,
    },
    is_reviewed: {
      type: Boolean,
      default: false,
    },
    review_date: {
      type: Date,
      default: null,
    },
    flagged_for_deletion: {
      type: Boolean,
      default: false,
    },
    user_agent: {
      type: String,
      default: "",
    },
    ipv4: {
      type: String,
      default: "",
    },
    ipv6: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ContactMessage",
  ContactMessageSchema,
  "ContactMessage"
);
