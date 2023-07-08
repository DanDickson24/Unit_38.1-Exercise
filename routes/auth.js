
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const User = require("../models/user");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // Authenticate user credentials (you can implement this logic using User.authenticate)
    const user = await User.authenticate(username, password);
    
    // Update last login timestamp
    await User.updateLoginTimestamp(username);
    
    // Generate JWT token
    const token = jwt.sign({ username: user.username }, SECRET_KEY);
    
    // Return the token
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post("/register", async (req, res, next) => {
  try {
    const { username, password, first_name, last_name, phone } = req.body;
    
    // Register a new user (you can implement this logic using User.register)
    const user = await User.register({ username, password, first_name, last_name, phone });
    
    // Update last login timestamp
    await User.updateLoginTimestamp(username);
    
    // Generate JWT token
    const token = jwt.sign({ username: user.username }, SECRET_KEY);
    
    // Return the token
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;