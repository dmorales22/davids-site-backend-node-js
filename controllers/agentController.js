const Agent = require("../models/Agent");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

/**
 * This function is to create an agent in the database.
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.createAgent = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!(email && password && first_name && last_name)) {
      return res
        .status(400)
        .send({ result: false, msg: "All input is required." }); // A controller method to create an Agent in the database. Creates a token for this user.
    }

    const existing_agent = await Agent.findOne({ email: email });

    if (existing_agent) {
      return res
        .status(409)
        .send({ result: false, msg: "Agent already exists in the system." });
    }

    const encrypted_password = await bcrypt.hash(password, 10);
    const agent = await Agent.create({
      first_name,
      last_name,
      email,
      password: encrypted_password,
    });

    if (process.env.DEPLOYMENT === "1") {
      res.cookie("jwt", agent.token, {
        expires: new Date(
          Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000
        ),
        secure: true,
        httpOnly: false,
      });
    } else {
      res.cookie("jwt", agent.token, {
        expires: new Date(
          Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000
        ),
        secure: false,
        httpOnly: true,
      });
    }

    return res.send({
      result: true,
      msg: "Agent has been successfully created.",
      data: {
        first_name: agent.first_name,
        last_name: agent.last_name,
      },
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ result: false, msg: "There was a server error." });
  }
};

/**
 * This function is to sign in  an Agent in the database.
 * Creates a token cookie for this user to use the system and routes.
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.signInAgent = async (req, res) => {
  try {
    let email = req.body.email;
    const password = req.body.password;

    if (!(email && password)) {
      return res
        .status(400)
        .send({ result: false, msg: "All input is required" });
    }

    email = email.toLowerCase();
    const agent = await Agent.findOne({ email });

    if (!agent) {
      return res
        .status(401)
        .send({ result: false, msg: "Invalid credentials." });
    }

    if (!(await bcrypt.compare(password, agent.password))) {
      return res
        .status(401)
        .send({ result: false, msg: "Invalid credentials." });
    }

    const token = jwt.sign(
      { user_id: agent._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "24h",
      }
    );

    //You can add additional attributes to the req.session objects
    req.session.agent_id = agent._id.toString();

    if (process.env.DEPLOYMENT === "1") {
      res.cookie("jwt", agent.token, {
        expires: new Date(
          Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000
        ),
        secure: true,
        httpOnly: false,
      });
    } else {
      res.cookie("jwt", agent.token, {
        expires: new Date(
          Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000
        ),
        secure: false,
        httpOnly: true,
      });
    }

    return res.send({
      result: true,
      msg: "Agent authentication is successful.",
      token: token,
      data: {
        first_name: agent.first_name,
        middle_name: agent.middle_name,
        last_name: agent.last_name,
        email: agent.email,
      },
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ result: false, msg: "There was a server error." });
  }
};

/**
 * This function will log out the agent by destroying session data and clear out the cookie.
 * @param req
 * @param res
 * @returns {Promise<void>}
 * @author David Morales
 */
exports.logoutAgent = async (req, res) => {
  req.session.destroy(function (err) {
    res.clearCookie("jwt");
    res.send("You are signed out.");
  });
};

/**
 * This function is used to get an Agent from the by using its ID
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.getAgentById = async (req, res) => {
  if (
    !req.body.agent_id ||
    !mongoose.isObjectIdOrHexString(req.body.agent_id)
  ) {
    return res.status(400).send({
      result: false,
      msg: "Error. Something is wrong with this request.",
    });
  }

  try {
    const agent_id = req.body.agent_id;
    const filter = {
      _id: mongoose.Types.ObjectId(agent_id),
    };
    const agent = await Agent.findById(filter);

    if (!agent) {
      return res.status(404).send({ result: false, msg: "Agent not found." });
    }

    return res.send(agent);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ result: false, msg: "There was a server error." });
  }
};

/**
 * This function is used to update an agent's information.
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.updateAgent = async (req, res) => {
  if (
    !req.body.agent_id ||
    !mongoose.isObjectIdOrHexString(req.body.agent_id)
  ) {
    return res.status(400).send({
      result: false,
      msg: "Error. Something is wrong with this request.",
    });
  }
  try {
    const agent_id = new mongoose.Types.ObjectId(req.body.agent_id);
    const filter = {
      _id: agent_id,
    };
    const agent = await Agent.findOne(filter);

    if (!agent) {
      return res.status(404).send({ result: false, msg: "Agent not found." });
    }

    const update_object = req.body.update_obj;
    await Agent.updateOne(filter, update_object, { new: true });

    return res.send({ result: true, msg: "Agent successfully updated!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      result: false,
      msg: "There was a server error.",
    });
  }
};

/**
 * This function is used to remove an agent from the database.
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @author David Morales
 */
exports.deleteAgent = async (req, res) => {
  try {
    const agent_id = new mongoose.Types.ObjectId(req.body.agent_id);
    await Agent.deleteOne({ _id: agent_id });

    return res.send({
      result: true,
      msg: "Agent has been deleted.",
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ result: false, msg: "There was a server error." });
  }
};
