const express = require("express");
const passport = require("passport");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const { addUser, updateUserMembership } = require("../models/user");

const validateCredentials = [
  body("firstName")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("First name is required"),
  body("lastName")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("Last name is required"),
  body("username").isEmail().normalizeEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];

router.get("/signup", (req, res) => {
  res.render("signup", { errors: [], error: null });
});

router.post(
  "/signup",
  validateCredentials,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signup", {
        errors: errors.array(),
        error: null,
      });
    }
    const { firstName, lastName, username, password } = req.body;
    try {
      await addUser(firstName, lastName, username, password);
      res.redirect("/auth/login");
    } catch (error) {
      res.render("signup", { errors: [], error: error });
    }
  })
);

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  })
);

router.get("/join", (req, res) => {
  if (req.isUnauthenticated()) {
    return res.redirect("/auth/login");
  }
  res.render("join", { user: req.user, error: null });
});

router.post("/join", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/login");
  }
  const { passcode } = req.body;
  const secretPasscode = "liya";

  if (passcode === secretPasscode) {
    await updateUserMembership(req.user.id);
    res.redirect("/");
  } else {
    res.render("join", { user: req.user, error: "Incorrect passcode" });
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
