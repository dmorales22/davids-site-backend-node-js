const jwt = require("jsonwebtoken");
const config = process.env;

/**
 * This function handles the token validation for the protected routes.
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"]; // Gets token from headers

  if (!token) {
    // Returns 403 error if token is not found
    return res.status(403).send("A token is required for authentication");
  }
  try {
    req.agent = jwt.verify(token, config.TOKEN_KEY); // Verifies toke
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
