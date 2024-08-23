//helpers/tokens.js

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
  console.assert(user.isAdmin !== undefined,
      "createToken passed user without isAdmin property");

  let payload = {
    username: user.username,
    isAdmin: user.isAdmin || false,
  };

  const token = jwt.sign(payload, SECRET_KEY);
  console.log("Generated Token:", token); // Debug
  return token;
}


module.exports = { createToken };
