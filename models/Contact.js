const mongoose = require("mongoose");


/**
 *
 * @type {module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, {timestamps: boolean}, {phone: {unique: boolean, type: StringConstructor, required: boolean}, last_name: StringConstructor, first_name: StringConstructor, email: {sparse: boolean, unique: boolean, type: StringConstructor}}>}
 */
const ContactSchema = new mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", ContactSchema, "Contact");
