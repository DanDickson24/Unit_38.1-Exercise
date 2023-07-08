const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", ensureLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Retrieve the message detail using the message id
    const message = await Message.getMessageById(id);
    
    // Check if the currently logged-in user is either the sender or receiver of the message
    if (message.from_user.username !== req.user.username && message.to_user.username !== req.user.username) {
      throw new Error("Unauthorized");
    }
    
    // Return the message detail
    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const { to_username, body } = req.body;
    const from_username = req.user.username;
    
    // Create a new message
    const message = await Message.createMessage(from_username, to_username, body);
    
    // Return the newly created message
    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post("/:id/read", ensureLoggedIn, ensureCorrectUser, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Mark the message as read using the message id
    const message = await Message.markMessageAsRead(id);
    
    // Return the updated message
    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
