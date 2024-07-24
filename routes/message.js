const express = require("express");
const { addMessage, getAllMessages } = require("../models/messages");

const router = express.Router();

router.get("/create", (req, res) => {
  if (req.isUnauthenticated()) {
    return res.redirect("/auth/login");
  }
  res.render("createMessage", { user: req.user });
});

router.post("/create", async (req, res) => {
  if (req.isUnauthenticated()) {
    return res.redirect("/auth/login");
  }
  const { title, text } = req.body;
  await addMessage(title, text, req.user.id);
  res.redirect("/");
});

module.exports = router;
