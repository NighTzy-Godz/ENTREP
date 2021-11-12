const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const User = require("../models/user");
const { isLoggedIn } = require("../middleware");

router.get("/chat/:id", isLoggedIn, async (req, res, next) => {
  try {
    req.flash(
      "success",
      "THIS IS JUST A CHAT SYSTEM PROTOTYPE. IT IS NOT WORKING. THANK YOU!"
    );
    res.render("chat/chat");
  } catch (e) {
    next(e);
  }
});

module.exports = router;
