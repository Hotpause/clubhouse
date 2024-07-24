const express = require("express");
const {
  addMessage,
  getAllMessages,
  deleteMessage,
} = require("../models/message");

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

router.post("/delete/:id", async (req, res) => {
  if (!req.isAuthenticated() || !req.user.is_admin) {
    return res.redirect("/");
  }
  const messageId = req.params.id;
  await deleteMessage(messageId);
  res.redirect("/");
});

module.exports = router;
