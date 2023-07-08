const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Message = require("../models/message");
const { ensureLoggedIn } = require("../middleware/auth");

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get("/", ensureLoggedIn, async (req, res, next) => {
  try {
    // Retrieve the list of users
    const users = await User.getAllUsers();
    
    // Return the list of users
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

/** GET /:username - get detail of user.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get("/:username", ensureLoggedIn, async (req, res, next) => {
  try {
    const { username } = req.params;
    
    // Retrieve the user detail using the username
    const user = await User.getUserByUsername(username);
    
    // Return the user detail
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/to", ensureLoggedIn, async (req, res, next) => {
  try {
    const { username } = req.params;
    
    // Retrieve the messages sent to the user
    const messages = await Message.getMessagesToUser(username);
    
    // Return the messages
    return res.json({ messages });
  } catch (err) {
    return next(err);
  }
});

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get("/:username/from", ensureLoggedIn, async (req, res, next) => {
  try {
    const { username } = req.params;
    
    // Retrieve the messages sent from the user
    const messages = await Message.getMessagesFromUser(username);
    
    // Return the messages
    return res.json({ messages });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
