const express = require("express");
const { getAllMessages } = require("../models/message");
const router = express.Router();

router.get("/", async (req, res) => {
  const messages = await getAllMessages();
  if (req.isAuthenticated()) {
    res.render("dashboard", { user: req.user, messages });
  } else {
    res.render("index", { user: req.user, messages });
  }
});

module.exports = router;
