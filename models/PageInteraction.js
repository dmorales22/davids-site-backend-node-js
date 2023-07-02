const mongoose = require("mongoose");

const PageInteractionSchema = new mongoose.Schema(
  {
    interaction_type: {
      //view
      type: String,
      default: "view",
    },
    interaction_descriptor: {
      type: String,
      default: "",
    },
    origin_type: {
      //match, qr-code, direct-link, etc
      type: String,
      default: "",
    },
    route: {
      type: String,
      default: "",
    },
    agent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      default: null,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    user_agent: {
      type: String,
      default: "",
    },
    ipv4: String,
    ipv6: {
      type: String,
      default: "",
    },
    ip_geo: {
      city: {
        type: String,
        default: "",
      },
      region: {
        type: String,
        default: "",
      },
      region_code: {
        type: String,
        default: "",
      },
      country_code: {
        type: String,
        default: "",
      },
      in_eu: {
        type: Boolean,
        default: false,
      },
      postal: {
        type: String,
        default: "",
      },
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
      timezone: {
        type: String,
        default: "",
      },
      asn: {
        type: String,
        default: "",
      },
      org: {
        type: String,
        default: "",
      },
      hostname: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "PageInteraction",
  PageInteractionSchema,
  "PageInteraction"
);
