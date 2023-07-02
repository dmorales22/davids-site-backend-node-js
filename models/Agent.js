const mongoose = require("mongoose");

/**
 *
 * @type {module:mongoose.Schema<any, Model<any, any, any, any>, {}, {}, {}, {}, {timestamps: boolean}, {password: StringConstructor, last_name: StringConstructor, first_name: StringConstructor, email: {unique: boolean, type: StringConstructor}, token: StringConstructor}>}
 */
const AgentSchema = new mongoose.Schema(
  {
    first_name: String,
    middle_name: {
      type: String,
      default: "",
    },
    last_name: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    token: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agent", AgentSchema, "Agent");
