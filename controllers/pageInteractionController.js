const PageInteraction = require("../models/PageInteraction");
const mongoose = require("mongoose");

/**
 * This function counts the number of different devices
 * @param userAgents
 * @returns {{other: number, android: number, linux: number, windows: number, ios: number, macos: number}}
 * @author David Morales, ChatGPT
 */
function countUserAgents(userAgents) {
  const counts = {
    windows: 0,
    ios: 0,
    android: 0,
    macos: 0,
    linux: 0,
    other: 0,
  };
  for (let i = 0; i < userAgents.length; i++) {
    if (userAgents[i].user_agent.indexOf("Windows") !== -1) {
      counts.windows++;
    } else if (
      userAgents[i].user_agent.indexOf("iPhone") !== -1 ||
      userAgents[i].user_agent.indexOf("iPad") !== -1
    ) {
      counts.ios++;
    } else if (userAgents[i].user_agent.indexOf("Android") !== -1) {
      counts.android++;
    } else if (userAgents[i].user_agent.indexOf("Macintosh") !== -1) {
      counts.macos++;
    } else if (userAgents[i].user_agent.indexOf("Linux") !== -1) {
      counts.linux++;
    } else {
      counts.other++;
    }
  }
  return counts;
}

/**
 * This function logs the interactions of a page when someone visits it.
 * @param {object} req
 * @param {object} res
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.createPageInteraction = async (req, res) => {
  try {
    let agent_id = null;

    if (
      req.session.agent_id &&
      mongoose.isObjectIdOrHexString(req.session.agent_id)
    ) {
      agent_id = mongoose.Types.ObjectId(req.session.agent_id);
    }

    const newPageInteraction = await PageInteraction.create({
      interaction_type: req.body.interaction_type,
      interaction_descriptor: req.body.interaction_descriptor,
      origin_type: req.body.origin_type,
      route: req.body.route,
      agent_id: agent_id,
      artifact_type: req.body.artifact_type,
      user_platform: "David's Site v1", //Change when there are more platforms
      user_agent: req.headers["user-agent"],
      ipv4: req.body.ipv4,
      ipv6: req.body.ipv6,
    });

    await newPageInteraction.save((err) => {
      if (err) {
        return console.log(err);
      }
      return res.send({ result: true, msg: "Information has been sent." });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ result: false, msg: "There was an error." });
  }
};

/**
 * This function get .
 * @param {object} req
 * @param {object} res
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.getPageInteractions = async (req, res) => {
  if (
    !req.session.agent_id ||
    !mongoose.isObjectIdOrHexString(req.body.contact_id)
  ) {
    return res.status(400).send({
      result: false,
      msg: "Error. Something is wrong with this request.",
    });
  }
  try {
    if (req.session.user_type !== "system") {
      return res.status(403).send({
        result: false,
        msg: "Forbidden",
      });
    }
    let limit = 50;

    if (req.body.limit) {
      limit = req.body.limit;
    }

    let chunk_index = 0;

    if (req.body.chunk_index) {
      chunk_index = req.body.chunk_index;
    }

    let sort_query = {};
    let sort = "1";

    if (req.body.sort) {
      sort = req.body.sort;
    }

    switch (
      sort //Checks query code and assigns different kinds of sort
    ) {
      case "1":
        sort_query = { createdAt: -1 }; //Descending order
        break;
      case "2":
        sort_query = { createdAt: 1 }; //Ascending order
        break;
      default:
        sort_query = { createdAt: -1 }; //Descending order
        break;
    }

    let query_count = 0;
    let filter = {};

    query_count = await PageInteraction.countDocuments(filter);
    //const page_interaction_stats = await calculatePageInteractionStats(filter);

    PageInteraction.find(filter, (err, page_interactions) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          result: false,
          msg: "There was a server error. :(",
        });
      } else {
        const artifact_obj = {
          //Constructing the object to include unit data and query metadata
          info: {
            query_str: "",
            query_count: query_count,
            stats: {},
          },
          data: page_interactions,
        };
        return res.send(artifact_obj);
      }
    })
      .skip(chunk_index)
      .limit(limit) //For pagination purposes
      .sort(sort_query);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ result: false, msg: "There was an error." });
  }
};
